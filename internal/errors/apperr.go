package errors

import "net/http"

type Code string

const (
	CodeBadRequest      Code = "bad_request"
	CodeUnauthorized    Code = "unauthorized"
	CodeNotFound        Code = "not_found"
	CodeInternal        Code = "internal_error"
	CodeExternalService Code = "external_service"
)

type AppError struct {
	Code       Code   `json:"code"`
	Message    string `json:"message"`
	HTTPStatus int    `json:"-"`
	Err        error  `json:"-"`
}

func New(code Code, msg string, status int, err error) *AppError {
	return &AppError{Code: code, Message: msg, HTTPStatus: status, Err: err}
}

func BadRequest(msg string, err error) *AppError {
	return New(CodeBadRequest, msg, http.StatusBadRequest, err)
}
func Unauthorized(msg string, err error) *AppError {
	return New(CodeUnauthorized, msg, http.StatusUnauthorized, err)
}
func Internal(msg string, err error) *AppError {
	return New(CodeInternal, msg, http.StatusInternalServerError, err)
}
