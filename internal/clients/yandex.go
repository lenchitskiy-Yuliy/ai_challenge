package clients

import (
	"bytes"
	"context"
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/x509"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"io"
	"net/http"
	"time"

	"main/internal/config"

	"github.com/sony/gobreaker"
	"go.uber.org/zap"
	"golang.org/x/time/rate"
)

type Message struct {
	Role string `json:"role"`
	Text string `json:"text"`
}

type YandexClient interface {
	CallCompletion(ctx context.Context, messages []Message) (string, error)
}

type yandexClient struct {
	envs   *config.Envs
	http   *http.Client
	logger *zap.Logger

	limiter *rate.Limiter
	cb      *gobreaker.CircuitBreaker
}

func NewYandexClient(envs *config.Envs, logger *zap.Logger) YandexClient {
	limiter := rate.NewLimiter(rate.Limit(envs.RateLimitRPS), int(envs.RateLimitRPS))

	st := gobreaker.Settings{
		Name:     "yandex_cb",
		Interval: 60 * time.Second,
		Timeout:  30 * time.Second,
		ReadyToTrip: func(counts gobreaker.Counts) bool {
			return counts.ConsecutiveFailures > 5 || (counts.TotalFailures > 5 && float64(counts.TotalFailures)/float64(counts.Requests) > 0.5)
		},
		OnStateChange: func(name string, from, to gobreaker.State) {
			logger.Info("circuit breaker state change", zap.String("name", name), zap.String("from", from.String()), zap.String("to", to.String()))
		},
	}

	cb := gobreaker.NewCircuitBreaker(st)

	return &yandexClient{
		envs:    envs,
		http:    &http.Client{Timeout: 30 * time.Second},
		logger:  logger,
		limiter: limiter,
		cb:      cb,
	}
}

func (c *yandexClient) CallCompletion(ctx context.Context, messages []Message) (string, error) {
	if err := c.limiter.WaitN(ctx, 1); err != nil {
		return "", fmt.Errorf("rate limit: %w", err)
	}

	res, err := c.cb.Execute(func() (interface{}, error) {
		token, err := c.getIAMToken()
		if err != nil {
			return nil, err
		}

		url := "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
		payload := map[string]interface{}{
			"modelUri": fmt.Sprintf("gpt://%s/yandexgpt/latest", c.envs.FolderID),
			"completionOptions": map[string]interface{}{
				"temperature": 0.6,
				"maxTokens":   500,
			},
			"messages": messages,
		}
		data, _ := json.Marshal(payload)
		req, _ := http.NewRequestWithContext(ctx, "POST", url, bytes.NewReader(data))
		req.Header.Set("Authorization", "Bearer "+token)
		req.Header.Set("Content-Type", "application/json")

		resp, err := c.http.Do(req)
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()
		body, _ := io.ReadAll(resp.Body)
		if resp.StatusCode != http.StatusOK {
			return nil, fmt.Errorf("llm returned %d: %s", resp.StatusCode, string(body))
		}
		var result map[string]interface{}
		if err := json.Unmarshal(body, &result); err != nil {
			return nil, err
		}
		resMap, ok := result["result"].(map[string]interface{})
		if !ok {
			return nil, fmt.Errorf("unexpected response format")
		}
		alts, ok := resMap["alternatives"].([]interface{})
		if !ok || len(alts) == 0 {
			return nil, fmt.Errorf("no alternatives")
		}
		alt0, ok := alts[0].(map[string]interface{})
		if !ok {
			return nil, fmt.Errorf("bad alt format")
		}
		msg, ok := alt0["message"].(map[string]interface{})
		if !ok {
			return nil, fmt.Errorf("no message")
		}
		text, _ := msg["text"].(string)
		return text, nil
	})

	if err != nil {
		c.logger.Error("call completion failed", zap.Error(err))
		return "", err
	}

	return res.(string), nil
}

func (c *yandexClient) getIAMToken() (string, error) {
	privateKey, err := parsePrivateKey(c.envs.PrivateKey)

	if err != nil {
		return "", fmt.Errorf("parse key: %w", err)
	}

	now := time.Now().Unix()
	claims := map[string]interface{}{
		"aud": "https://iam.api.cloud.yandex.net/iam/v1/tokens",
		"iss": c.envs.ServiceAccountID,
		"sub": c.envs.ServiceAccountID,
		"exp": now + 3600,
		"iat": now,
	}
	payload, _ := json.Marshal(claims)
	header := fmt.Sprintf(`{"alg":"PS256","kid":"%s"}`, c.envs.KeyID)
	encodedHeader := base64.RawURLEncoding.EncodeToString([]byte(header))
	encodedPayload := base64.RawURLEncoding.EncodeToString(payload)
	signingInput := encodedHeader + "." + encodedPayload
	hashed := sha256.Sum256([]byte(signingInput))
	signature, err := rsa.SignPSS(rand.Reader, privateKey, crypto.SHA256, hashed[:], &rsa.PSSOptions{SaltLength: 32})
	if err != nil {
		return "", fmt.Errorf("sign: %w", err)
	}
	encodedSignature := base64.RawURLEncoding.EncodeToString(signature)
	jwt := signingInput + "." + encodedSignature

	resp, err := http.Post("https://iam.api.cloud.yandex.net/iam/v1/tokens", "application/json", bytes.NewReader([]byte(`{"jwt":"`+jwt+`"}`)))
	if err != nil {
		return "", fmt.Errorf("iam http: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		b, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("iam status %d: %s", resp.StatusCode, string(b))
	}
	var out struct {
		IAMToken string `json:"iamToken"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return "", fmt.Errorf("iam decode: %w", err)
	}
	return out.IAMToken, nil
}

func parsePrivateKey(pemData string) (*rsa.PrivateKey, error) {
	block, _ := pem.Decode([]byte(pemData))
	if block == nil {
		return nil, fmt.Errorf("pem decode failed")
	}
	key, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		return nil, err
	}
	rsaKey, ok := key.(*rsa.PrivateKey)
	if !ok {
		return nil, fmt.Errorf("not rsa key")
	}
	return rsaKey, nil
}
