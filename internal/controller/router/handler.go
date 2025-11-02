package router

import (
	"context"
	"encoding/json"
	"log"
	"main/internal/errors"
	"net/http"
)

type AppHandler func(ctx context.Context, r *http.Request) (interface{}, *errors.AppError)

func MakeHandler(fn AppHandler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), http.ServerContextKey, w)

		res, appErr := fn(ctx, r)
		if appErr != nil {
			if appErr.Err != nil && appErr.HTTPStatus >= 500 {
				log.Printf("[ERROR] %s: %v", appErr.Message, appErr.Err)
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(appErr.HTTPStatus)
			_ = json.NewEncoder(w).Encode(map[string]interface{}{
				"error": map[string]interface{}{
					"code":    appErr.Code,
					"message": appErr.Message,
				},
			})
			return
		}

		if res == nil {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(res); err != nil {
			log.Printf("encode response error: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
		}
	})
}
