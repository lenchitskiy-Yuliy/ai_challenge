package api

import (
	"context"
	"encoding/json"
	"io"
	"main/internal/controller/router"
	"main/internal/errors"
	"net/http"

	"main/internal/usecase"
)

type messageDTO struct {
	Role string `json:"role"`
	Text string `json:"text"`
}

type requestDTO struct {
	Messages []messageDTO `json:"messages"`
}

type responseDTO struct {
	Reply string `json:"reply"`
}

func MakeGPTHandler(GPTUsecase usecase.GPTUsecase) router.AppHandler {
	return func(ctx context.Context, r *http.Request) (interface{}, *errors.AppError) {
		body, err := io.ReadAll(r.Body)

		if err != nil {
			return nil, errors.BadRequest("cannot read body", err)
		}

		var req requestDTO

		if err := json.Unmarshal(body, &req); err != nil {
			return nil, errors.BadRequest("invalid JSON", err)
		}

		if len(req.Messages) == 0 {
			return nil, errors.BadRequest("messages is empty", nil)
		}

		msgs := make([]usecase.GPTMessage, 0, len(req.Messages))

		for _, m := range req.Messages {
			msgs = append(msgs, usecase.GPTMessage{Role: m.Role, Text: m.Text})
		}

		errGPT, reply := GPTUsecase.Complete(ctx, msgs)

		if errGPT != nil {
			return nil, errors.Internal("gpt completion failed", errGPT.Err)
		}

		return responseDTO{Reply: reply}, nil
	}
}
