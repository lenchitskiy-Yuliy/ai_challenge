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

// ResponseData holds the complete response from an external service (passed through as-is).
// This struct is used for transparent proxying where the response status code, headers,
// and body are forwarded directly to the client without any modification or parsing.
type ResponseData struct {
	StatusCode int
	Headers    map[string][]string
	Body       []byte
}

type YandexClient interface {
	CallCompletion(ctx context.Context, body map[string]interface{}) (*ResponseData, error)
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

// CallCompletion forwards a request to Yandex's completion API and returns the response as-is.
// This implements transparent proxying:
// - The HTTP status code from Yandex is preserved and returned
// - The response body from Yandex is returned without modification or parsing
// - All response headers from Yandex are included
//
// The method handles authentication (IAM token), rate limiting, and circuit breaking.
// No business logic is applied to the response - it is returned exactly as received from Yandex.
func (c *yandexClient) CallCompletion(ctx context.Context, body map[string]interface{}) (*ResponseData, error) {
	// Apply rate limiting with context awareness
	if err := c.limiter.WaitN(ctx, 1); err != nil {
		return nil, fmt.Errorf("rate limit: %w", err)
	}

	// Execute with circuit breaker for fault tolerance
	res, err := c.cb.Execute(func() (interface{}, error) {
		// Obtain Yandex IAM token
		token, err := c.getIAMToken()
		if err != nil {
			return nil, err
		}

		// Prepare Yandex API endpoint
		url := "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"

		// Merge user options with default completion options
		defaultCompletion := map[string]interface{}{
			"temperature": 0.6,
			"maxTokens":   500,
		}

		payload := map[string]interface{}{
			"modelUri":          fmt.Sprintf("gpt://%s/yandexgpt/latest", c.envs.FolderID),
			"completionOptions": defaultCompletion,
		}

		if userOpts, ok := body["completionOptions"].(map[string]interface{}); ok {
			for k, v := range userOpts {
				defaultCompletion[k] = v
			}
			payload["completionOptions"] = defaultCompletion
			delete(body, "completionOptions")
		}

		for k, v := range body {
			payload[k] = v
		}

		// Build and send HTTP request to Yandex
		data, err := json.Marshal(payload)
		if err != nil {
			return nil, fmt.Errorf("marshal request payload: %w", err)
		}

		req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewReader(data))
		if err != nil {
			return nil, fmt.Errorf("create request: %w", err)
		}

		req.Header.Set("Authorization", "Bearer "+token)
		req.Header.Set("Content-Type", "application/json")

		resp, err := c.http.Do(req)
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()

		// Read the complete response body from Yandex
		bodyResp, err := io.ReadAll(resp.Body)
		if err != nil {
			return nil, fmt.Errorf("read response body: %w", err)
		}

		// Return the complete response unchanged (transparent proxy behavior)
		// Status code, headers, and body are all from Yandex, unmodified
		return &ResponseData{
			StatusCode: resp.StatusCode,
			Headers:    resp.Header,
			Body:       bodyResp,
		}, nil
	})

	if err != nil {
		c.logger.Error("call completion failed", zap.Error(err))
		return nil, err
	}

	return res.(*ResponseData), nil
}

func (c *yandexClient) getIAMToken() (string, error) {
	privateKey, err := parsePrivateKey(c.envs.PrivateKey)
	if err != nil {
		return "", fmt.Errorf("parse key: %w", err)
	}

	// Prepare JWT claims
	now := time.Now().Unix()
	claims := map[string]interface{}{
		"aud": "https://iam.api.cloud.yandex.net/iam/v1/tokens",
		"iss": c.envs.ServiceAccountID,
		"sub": c.envs.ServiceAccountID,
		"exp": now + 3600,
		"iat": now,
	}

	payload, err := json.Marshal(claims)
	if err != nil {
		return "", fmt.Errorf("marshal claims: %w", err)
	}

	// Build JWT token
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

	// Exchange JWT for IAM token
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
