package utils

import (
	"log"
	"os"
)

func GetEnv(key string) string {
	return os.Getenv(key)
}

func MustGetEnv(key string) string {
	value := os.Getenv(key)

	if value == "" {
		log.Fatalf("Environment variable %s is required", key)
	}

	return value
}
