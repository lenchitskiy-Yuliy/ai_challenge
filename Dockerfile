# ---------- STAGE 1: Build Go backend ----------
FROM golang:1.24.0 AS builder

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем только go.mod и go.sum для кеша зависимостей
COPY go.mod go.sum ./

# Загружаем зависимости
RUN go mod download

# Копируем весь исходный код проекта
COPY . .

# Собираем бинарник
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o server ./cmd/main.go


# ---------- STAGE 2: Build frontend ----------
FROM node:20-alpine AS client-builder

WORKDIR /client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build


# ---------- STAGE 3: Runtime ----------
FROM alpine:latest

WORKDIR /app

# Копируем бинарник из Go-стейджа
COPY --from=builder /app/server .

# Копируем статические файлы SPA
COPY --from=client-builder /client/dist ./static

# Порт, который слушает приложение
EXPOSE 80

# Запускаем бинарь
CMD ["./server", "--port", "80"]
