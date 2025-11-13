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

func MakeGPTHandler(GPTUsecase usecase.GPTUsecase) router.AppHandler {
	return func(ctx context.Context, r *http.Request) (interface{}, *errors.AppError) {
		body, err := io.ReadAll(r.Body)

		if err != nil {
			return nil, errors.BadRequest("cannot read body", err)
		}

		var req map[string]interface{}

		if err := json.Unmarshal(body, &req); err != nil {
			return nil, errors.BadRequest("invalid JSON", err)
		}

		errGPT, responseData := GPTUsecase.Complete(ctx, req)

		if errGPT != nil {
			return nil, errors.Internal("gpt completion failed", errGPT.Err)
		}

		return responseData, nil
	}
}
