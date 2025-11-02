package config

import (
	"main/internal/constants"
	"main/internal/utils"
	"os"
	"strings"
)

type Envs struct {
	ServiceAccountID string
	KeyID            string
	PrivateKey       string
	FolderID         string
	Port             string
	DevMode          bool
	SecretAppKey     string
	RateLimitRPS     float64
	ClientPort       string
}

func LoadFromEnv() (*Envs, error) {
	envs := &Envs{
		Port:             utils.MustGetEnv(constants.PORT),
		ServiceAccountID: utils.MustGetEnv(constants.GPT_ACCOUNT_ID),
		KeyID:            utils.MustGetEnv(constants.GPT_KEY_ID),
		FolderID:         utils.MustGetEnv(constants.GPT_FOLDER_ID),
		SecretAppKey:     utils.MustGetEnv(constants.SECRET_APP_KEY),
		ClientPort:       utils.GetEnv(constants.CLIENT_PORT),
		DevMode:          utils.GetEnv(constants.DEV_MODE) == "1",
		RateLimitRPS:     2,
	}

	privateKey, err := loadPrivateKey()
	if err != nil {
		return nil, err
	}

	envs.PrivateKey = privateKey

	return envs, nil
}

func loadPrivateKey() (string, error) {
	if key := utils.GetEnv(constants.GPT_PRIVATE_KEY); key != "" {
		return strings.Replace(key, "\\n", "\n", -1), nil
	}

	if keyFile := utils.GetEnv(constants.GPT_PRIVATE_KEY_FILE); keyFile != "" {
		return utils.LoadFile(keyFile)
	}

	return "", os.ErrNotExist
}
