module main

go 1.24.0

toolchain go1.24.9

require (
	github.com/golang-jwt/jwt v3.2.2+incompatible
	github.com/golang-jwt/jwt/v4 v4.5.2
	github.com/rs/cors v1.10.0
)

require (
	go.uber.org/multierr v1.10.0 // indirect
	golang.org/x/time v0.14.0 // indirect
)

require (
	github.com/joho/godotenv v1.5.1 // indirect
	github.com/sony/gobreaker v1.0.0
	go.uber.org/zap v1.27.0
)

replace internal/entities => ./internal/entities

replace internal/usecases => ./internal/usecases

replace internal/interfaces/http => ./internal/interfaces/http
