# Task CRUD API reference

## Base URL

Local development: `http://localhost:3000/api/v1`

The server port is configurable with `PORT`. All request and response bodies use JSON unless noted otherwise.

## Authentication

Register and login return an access token in the response body. Send it on protected requests:

```http
Authorization: Bearer <accessToken>
```

Access tokens expire after 15 minutes. Login, registration, and refresh also set an HTTP-only `refreshToken` cookie. Browsers must send credentials for refresh/logout requests (for example, `credentials: "include"` in `fetch`). The cookie is scoped to `/api/v1/auth`; in production it is marked `Secure` and `SameSite=None`.

## Endpoints

### Health check

`GET /healthcheck`

No authentication required.

Example response (`200`):

```json
{
  "success": true,
  "message": "Server is running and everything is OK",
  "data": null
}
```

### Register

`POST /auth/register`

Request:

```json
{
  "name": "Alex Example",
  "email": "alex@example.com",
  "password": "example123"
}
```

Name must be 3–60 characters. Email is normalized to lowercase. Password must be at least 8 characters and contain a letter and a number.

Success (`201`): returns the user and access token in `data`, and sets the refresh cookie.

### Login

`POST /auth/login`

Request:

```json
{
  "email": "alex@example.com",
  "password": "example123"
}
```

Success (`200`): returns the user and access token in `data`, and sets the refresh cookie. Invalid credentials return `401`.

### Refresh access token

`POST /auth/refresh`

No JSON body is needed. Send the refresh cookie. The cookie is rotated and a new access token is returned.

Success (`200`):

```json
{
  "success": true,
  "message": "User successfully logged in",
  "data": {
    "user": {
      "_id": "<user-id>",
      "name": "Alex Example",
      "email": "alex@example.com"
    },
    "accessToken": "<access-token>"
  }
}
```

Missing, expired, or revoked refresh tokens return `401`.

### Logout

`POST /auth/logout`

No JSON body is needed. Send the refresh cookie. The stored refresh token is revoked and the cookie is cleared. In production, the request must include an `Origin` header exactly matching the configured `CLIENT_URL`; missing or different origins are rejected with `403`.

### Current user

`POST /auth/me`

Requires a bearer access token. Returns the signed-in user in `data.user`.

### List tasks

`GET /tasks`

Requires a bearer access token. Results are scoped to the signed-in user.

Optional query parameters:

| Parameter | Default | Allowed values / behavior |
|---|---:|---|
| `page` | `1` | Integer, minimum `1` |
| `limit` | `20` | Integer from `1` to `100` |
| `status` | — | `todo`, `in-progress`, `done` |
| `priority` | — | `low`, `medium`, `high` |
| `search` | — | Case-insensitive match in title or description; maximum 100 characters |
| `sortBy` | `createdAt` | `createdAt`, `updatedAt`, `dueDate`, `priority`, `status` |
| `sortOrder` | `desc` | `asc` or `desc` |

Example: `GET /tasks?status=todo&search=report&page=1&limit=10&sortBy=dueDate&sortOrder=asc`

Success (`200`) includes pagination metadata:

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "tasks": []
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

### Create task

`POST /tasks`

Requires a bearer access token.

Request:

```json
{
  "title": "Prepare project notes",
  "description": "Summarize this week's progress",
  "status": "todo",
  "priority": "medium",
  "dueDate": "2026-12-01"
}
```

Only `title` is required. Title is limited to 120 characters, description to 1000. Status defaults to `todo`, priority to `low`, and due date to `null`.

Success (`201`): returns the created task in `data.task`.

### Get task

`GET /tasks/:id`

Requires a bearer access token. Returns `data.task` if the task belongs to the signed-in user; otherwise returns `404`.

### Update task

`PATCH /tasks/:id`

Requires a bearer access token. Include one or more fields from the create-task request. Fields are validated using the same rules. An empty update is rejected.

Success (`200`): returns the updated task in `data.task`.

### Delete task

`DELETE /tasks/:id`

Requires a bearer access token. Deletes a task belonging to the signed-in user and returns the deleted task in `data.task`. A task that does not exist or belongs to someone else returns `404`.

## Task object

```json
{
  "id": "<task-id>",
  "title": "Prepare project notes",
  "description": "Summarize this week's progress",
  "status": "todo",
  "priority": "medium",
  "dueDate": "2026-12-01T00:00:00.000Z",
  "owner": "<user-id>",
  "createdAt": "2026-11-25T10:00:00.000Z",
  "updatedAt": "2026-11-25T10:00:00.000Z"
}
```

## Errors

Errors use this JSON shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Invalid input"
    }
  ]
}
```

Common status codes: `400` invalid input or ID, `401` missing/invalid/expired authentication, `404` route or task not found, `409` duplicate email, and `500` unexpected server error. A task owned by another user is reported as `404`.
