package app

import (
	"main/internal/clients"
	"main/internal/config"
	"main/internal/controller/api"
	"main/internal/controller/guards"
	"main/internal/controller/router"
	"main/internal/usecase"
	"net/http"
	"os"
	"path/filepath"

	"go.uber.org/zap"
)

func Run(envs *config.Envs, l *zap.Logger, r *router.Router) {
	yandexClient := clients.NewYandexClient(envs, l.Named("yandex"))
	gptUC := usecase.NewGPTUsecase(yandexClient, l.Named("usecase"))

	authGuards := guards.NewAuthGuards(envs, l.Named("guards"))

	r.Get("/api/auth-check", router.MakeHandler(api.AuthCheckHandler(envs)))
	r.Post("/api/login", router.MakeHandler(api.LoginHandler(envs, l.Named("login"))))
	r.Post("/api/gpt", router.MakeHandler(api.MakeGPTHandler(gptUC)), authGuards.RequireCookieAuth())

	staticDir := "./static"
	fs := http.FileServer(http.Dir(staticDir))

	r.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {

		path := filepath.Join(staticDir, req.URL.Path)

		if info, err := os.Stat(path); err == nil && !info.IsDir() {
			fs.ServeHTTP(w, req)
			return
		}

		http.ServeFile(w, req, filepath.Join(staticDir, "index.html"))
	}))

}
