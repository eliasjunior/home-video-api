# Home video API

[Documentation](https://github.com/eliasjunior/home-video-docs)

## Setup

```bash
npm install
npm test
npm run dev
```

## Environment Variables

JWT settings (required for auth):

```env
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_TTL="15m"
JWT_REFRESH_TTL="180d"
```

## Authentication Overview

This project uses **JWT access + refresh tokens**:
- Access token: short‑lived (default `15m`) and sent on every protected request.
- Refresh token: long‑lived (default `180d`) and used to get a new access token.

Refresh tokens are stored **in memory** via an adapter. This is intentional for now and will be replaced later with a persistent store.

Default user (hard‑coded):
- `username`: `admin`
- `password`: `password`

## Endpoints

Public:
- `GET /health`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

Protected:
- All existing video/series endpoints require `Authorization: Bearer <accessToken>`.

## Auth Flow (Example)

### SPA Redirect Behavior
The API returns `401` JSON for missing/invalid access tokens.  
The **React SPA** should catch `401` and redirect the user to `/login`.

### 1) Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

Response includes:
```json
{ "accessToken": "...", "refreshToken": "..." }
```

### 2) Call Protected Endpoint
```bash
curl http://localhost:8080/videos \
  -H "Authorization: Bearer <accessToken>"
```

### 3) Refresh Tokens
```bash
curl -X POST http://localhost:8080/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

### 4) Logout (revoke refresh token)
```bash
curl -X POST http://localhost:8080/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

## Notes
- Refresh tokens are rotated on each refresh call.
- Tokens are in memory; restarting the server clears refresh tokens.



