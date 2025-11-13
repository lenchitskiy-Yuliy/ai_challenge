package usecase

import (
	"context"

	"main/internal/clients"
	"main/internal/errors"

	"go.uber.org/zap"
)

type GPTMessage struct {
	Role string
	Text string
}

type GPTUsecase interface {
	Complete(ctx context.Context, body map[string]interface{}) (*errors.AppError, *clients.ResponseData)
}

type gptUsecase struct {
	client clients.YandexClient
	logger *zap.Logger
}

func NewGPTUsecase(c clients.YandexClient, logger *zap.Logger) GPTUsecase {
	return &gptUsecase{client: c, logger: logger}
}

func (g *gptUsecase) Complete(ctx context.Context, body map[string]interface{}) (*errors.AppError, *clients.ResponseData) {
	reply, err := g.client.CallCompletion(ctx, body)
	if err != nil {
		g.logger.Error("client error", zap.Error(err))
		return errors.Internal("failed to call external model", err), nil
	}
	return nil, reply
}
