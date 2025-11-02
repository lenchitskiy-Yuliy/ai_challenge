package main

import (
	"context"
	"fmt"
	"main/internal/app"
	"main/internal/config"
	"main/internal/controller/router"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/joho/godotenv"
	"github.com/rs/cors"

	"go.uber.org/zap"
)

func main() {
	logger, _ := zap.NewProduction()
	defer logger.Sync()
	sugar := logger.Sugar()

	godotenv.Load()
	envs, err := config.LoadFromEnv()

	if err != nil {
		sugar.Fatalf("failed load env: %v", err)
	}

	r := router.NewRouter(logger.Named("http"))

	app.Run(envs, logger, r)

	allowedOrigins := []string{}

	if envs.ClientPort != "" {
		allowedOrigins = []string{fmt.Sprintf("http://localhost:%s", envs.ClientPort)}
	} else {
		allowedOrigins = []string{"*"}
	}

	c := cors.New(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Accept", "Origin"},
		AllowCredentials: true,
	})

	srv := &http.Server{
		Addr:    ":" + envs.Port,
		Handler: c.Handler(r),
	}

	go func() {
		sugar.Infof("server listening on %s", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			sugar.Fatalf("listen: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	sugar.Info("shutdown signal received")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		sugar.Fatalf("server forced to shutdown: %v", err)
	}
	sugar.Info("server exiting")

}
