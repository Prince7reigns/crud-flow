# Task CRUD API

## Run locally

1. Install Node.js and MongoDB.
2. Copy `.env.example` to `.env` and set `MONGO_URI`, two different private JWT secrets, and `CLIENT_URL` to your frontend's exact origin.
3. Install dependencies with `npm install`.
4. Start the API with `npm run dev` (or `npm start`).

The API listens on `PORT` (default `3000`) and connects to MongoDB before it starts accepting requests. Health check: `GET /api/v1/healthcheck`.

See [API.md](./API.md) for endpoint details, request/response examples, authentication, and error formats.

## Authentication

- `POST /api/v1/auth/register` — create an account.
- `POST /api/v1/auth/login` — log in; returns an access token and sets an HTTP-only refresh-token cookie.
- `POST /api/v1/auth/refresh` — rotate the refresh token and return a new access token.
- `POST /api/v1/auth/logout` — revoke the refresh token and clear its cookie.
- `POST /api/v1/auth/me` — return the authenticated user.

Send the access token as `Authorization: Bearer <token>` for protected routes.

## Tasks

Every task endpoint requires an access token. Tasks are scoped to the signed-in user.

- `GET /api/v1/tasks` — list your tasks with optional `page`, `limit` (up to 100), `status`, `priority`, `search`, `sortBy`, and `sortOrder` query parameters. For example: `/api/v1/tasks?status=todo&search=report&page=1&limit=10&sortBy=dueDate&sortOrder=asc`. The response includes pagination totals in `meta`.
- `POST /api/v1/tasks` — create a task (`title` required; `description`, `status`, `priority`, and `dueDate` optional).
- `GET /api/v1/tasks/:id` — get one of your tasks.
- `PATCH /api/v1/tasks/:id` — update one or more task fields.
- `DELETE /api/v1/tasks/:id` — delete one of your tasks.

Statuses are `todo`, `in-progress`, and `done`; priorities are `low`, `medium`, and `high`.
