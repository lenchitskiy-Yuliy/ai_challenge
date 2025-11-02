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
	Complete(ctx context.Context, messages []GPTMessage) (*errors.AppError, string)
}

type gptUsecase struct {
	client clients.YandexClient
	logger *zap.Logger
}

func NewGPTUsecase(c clients.YandexClient, logger *zap.Logger) GPTUsecase {
	return &gptUsecase{client: c, logger: logger}
}

func (g *gptUsecase) Complete(ctx context.Context, messages []GPTMessage) (*errors.AppError, string) {
	cms := make([]clients.Message, 0, len(messages))

	for _, m := range messages {
		cms = append(cms, clients.Message{Role: m.Role, Text: m.Text})
	}

	reply, err := g.client.CallCompletion(ctx, cms)

	if err != nil {
		g.logger.Error("client error", zap.Error(err))
		return errors.Internal("failed to call external model", err), ""
	}

	return nil, reply
}
