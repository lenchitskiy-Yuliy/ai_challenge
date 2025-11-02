package api

import (
	"context"
	"encoding/json"
	"net/http"

	"main/internal/config"
	"main/internal/constants"
	"main/internal/controller/router"
	"main/internal/errors"

	"go.uber.org/zap"
)

type loginReq struct {
	Password string `json:"password"`
}

func AuthCheckHandler(envs *config.Envs) router.AppHandler {
	return func(ctx context.Context, r *http.Request) (interface{}, *errors.AppError) {
		cookie, err := r.Cookie(constants.AUTH_COOKIE_NAME)

		if err != nil {
			return nil, errors.Unauthorized("missing auth cookie", err)
		}

		if cookie.Value != envs.SecretAppKey {
			return nil, errors.Unauthorized("invalid auth cookie", nil)
		}

		return map[string]string{"status": "ok"}, nil
	}
}

func LoginHandler(envs *config.Envs, logger *zap.Logger) router.AppHandler {
	return func(ctx context.Context, r *http.Request) (interface{}, *errors.AppError) {
		var data loginReq

		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			return nil, errors.BadRequest("invalid json", err)
		}

		if data.Password != envs.SecretAppKey {
			return nil, errors.Unauthorized("wrong password", nil)
		}

		cookie := &http.Cookie{
			Name:     constants.AUTH_COOKIE_NAME,
			Value:    envs.SecretAppKey,
			Path:     "/",
			HttpOnly: true,
			Secure:   false,
			SameSite: http.SameSiteLaxMode,
		}

		w := r.Context().Value(http.ServerContextKey).(http.ResponseWriter)
		http.SetCookie(w, cookie)

		return map[string]string{"status": "ok", "set_cookie": constants.AUTH_COOKIE_NAME}, nil
	}
}
