package guards

import (
	"encoding/json"
	"net/http"

	"main/internal/config"
	"main/internal/constants"

	"go.uber.org/zap"
)

type Guards struct {
	envs   *config.Envs
	logger *zap.Logger
}

func NewAuthGuards(envs *config.Envs, logger *zap.Logger) *Guards {
	return &Guards{envs: envs, logger: logger}
}

func (guards *Guards) RequireCookieAuth() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			cookie, err := r.Cookie(constants.AUTH_COOKIE_NAME)

			if err != nil {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				_ = json.NewEncoder(w).Encode(map[string]interface{}{"error": map[string]string{"code": "unauthorized", "message": "missing cookie"}})
				return
			}

			if cookie.Value != guards.envs.SecretAppKey {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				_ = json.NewEncoder(w).Encode(map[string]interface{}{"error": map[string]string{"code": "unauthorized", "message": "invalid cookie"}})
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
