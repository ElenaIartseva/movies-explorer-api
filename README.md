# movies-explorer-api

Бэкенд сервиса, в котором можно найти фильмы по запросу и сохранить в личном кабинете

## Функционал

- Регистрация и авторизация пользователя (JWT)
- Редактирование профиля
- Получение списка сохранённых фильмов
- Сохранение и удаление фильмов

## Стек технологий

- Node.js 18+
- Express 4
- MongoDB, Mongoose
- JWT, Celebrate, Helmet, Winston
- Vitest, Supertest, ESLint, Prettier

## Архитектура проекта

```
app.js                 # Express-приложение (без listen)
server.js              # Подключение к MongoDB и запуск сервера
controllers/           # Пользователи и фильмы
models/                # Схемы Mongoose
routes/                # Маршруты и Celebrate-валидация
middlewares/           # auth, CORS-логика, логгер, rate limit, ошибки
errors/                # HTTP-ошибки (400 / 401 / 403 / 404 / 409)
utils/                 # конфиг, JWT, URL_REGEX
tests/                 # интеграционные тесты API
```

## Запуск проекта

### Требования

- Node.js 18+
- npm 9+
- MongoDB (локально или Atlas)

### Установка

```bash
git clone https://github.com/ElenaIartseva/movies-explorer-api.git
cd movies-explorer-api
npm install
```

### Переменные окружения

Скопируйте `.env.example` в `.env` и при необходимости измените значения:

```bash
cp .env.example .env
```

| Переменная | Описание |
|------------|----------|
| `PORT` | Порт сервера (по умолчанию 3000) |
| `MONGO_URL` | Строка подключения к MongoDB |
| `JWT_SECRET` | Секрет подписи JWT (обязателен в production) |
| `NODE_ENV` | `development` / `production` / `test` |
| `ALLOWED_ORIGINS` | Список origin через запятую, например `http://localhost:5173` |

### Команды

| Команда | Описание |
|---------|----------|
| `npm start` | Запуск сервера |
| `npm run dev` | Запуск с nodemon |
| `npm test` | Интеграционные тесты (Vitest) |
| `npm run test:watch` | Тесты в watch-режиме |
| `npm run lint` | Проверка ESLint |
| `npm run lint:fix` | Автоисправление ESLint |
| `npm run format` | Форматирование Prettier |

## API

| Метод | Путь | Авторизация | Описание |
|-------|------|-------------|----------|
| GET | `/health` | нет | Проверка доступности |
| POST | `/signup` | нет | Регистрация (`name`, `email`, `password` ≥ 8) |
| POST | `/signin` | нет | Вход, ответ: `jwt`, `name`, `email`, `_id` |
| GET | `/users/me` | Bearer | Текущий пользователь |
| PATCH | `/users/me` | Bearer | Обновление имени и email (409 если email занят) |
| GET | `/movies` | Bearer | Сохранённые фильмы текущего пользователя |
| POST | `/movies` | Bearer | Сохранить фильм (`movieId` — id из Beatfilm) |
| DELETE | `/movies/:_id` | Bearer | Удалить сохранённый фильм по `_id` в MongoDB |

## Ссылки

Frontend: https://github.com/ElenaIartseva/movies-explorer-frontend

---

# movies-explorer-api (EN)

Backend for searching movies and saving them to a personal account.

**Stack:** Node.js 18+, Express, MongoDB, Mongoose, JWT, Vitest, ESLint, Prettier.

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm start` — production server
- `npm run dev` — nodemon
- `npm test` — API tests
- `npm run lint` — lint code
- `npm run format` — format with Prettier

## Links

Frontend: https://github.com/ElenaIartseva/movies-explorer-frontend
