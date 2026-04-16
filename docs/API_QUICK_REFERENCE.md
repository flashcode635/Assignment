# API Quick Reference Guide

## Endpoints Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register` | POST | ❌ | Register new user |
| `/auth/login` | POST | ❌ | Login & get access token |
| `/auth/refresh` | POST | 🔐 Cookie | Refresh access token |
| `/auth/logout` | POST | 🔐 Cookie | Logout & invalidate token |
| `/todos` | GET | 🔐 Bearer | Get all user's todos |
| `/todos` | POST | 🔐 Bearer | Create new todo |
| `/todos/{id}` | PATCH | 🔐 Bearer | Update todo |
| `/todos/{id}` | DELETE | 🔐 Bearer | Delete todo |
| `/users` | GET | 🔐 Admin | Get all users (admin only) |

---

## Authentication

### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Secure123",
  "role": "USER"
}
```

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Secure123",
  "role": "USER"
}

Response: { "accessToken": "...", "user": {...} }
```

### Refresh Token
```http
POST /api/v1/auth/refresh
Cookie: refreshToken=...

Response: { "accessToken": "..." }
```

### Logout
```http
POST /api/v1/auth/logout
Cookie: refreshToken=...

Response: { "message": "Logged out successfully" }
```

---

## Todos

### Get All Todos
```http
GET /api/v1/todos
Authorization: Bearer <accessToken>

Response: { "tasks": [...] }
```

### Create Todo
```http
POST /api/v1/todos
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Task title",
  "description": "Optional description"
}

Response: { "task": {...} }
```

### Update Todo
```http
PATCH /api/v1/todos/{id}
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Updated title",
  "isCompleted": true
}

Response: { "task": {...} }
```

### Delete Todo
```http
DELETE /api/v1/todos/{id}
Authorization: Bearer <accessToken>

Response: { "message": "Task deleted successfully" }
```

---

## Admin Endpoints

### Get All Users
```http
GET /api/v1/users
Authorization: Bearer <accessToken>
Required Role: ADMIN

Response: { "users": [...] }
```

---

## Request Headers

### For Protected Routes
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### For Refresh/Logout
```
Cookie: refreshToken=...
```

---

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Error Response Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400,
  "details": ["Validation errors..."]
}
```

---

## Common Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Invalid request data |
| `UNAUTHORIZED` | Missing/invalid token |
| `FORBIDDEN` | Insufficient permissions |
| `USER_EXISTS` | Email already registered |
| `NOT_FOUND` | Resource not found |

---

## Password Requirements

- ✅ Minimum 8 characters
- ✅ At least 1 uppercase letter (A-Z)
- ✅ At least 1 lowercase letter (a-z)
- ✅ At least 1 number (0-9)

---

## Token Lifetimes

| Token Type | Lifetime | Storage |
|------------|----------|---------|
| Access Token | 15 minutes | Client (memory/localStorage) |
| Refresh Token | 7 days | httpOnly cookie |

---

## Field Validations

### Task Title
- Required for creation
- Max 255 characters
- Optional for updates

### Task Description
- Optional
- Max 5000 characters
- Nullable

### Email
- Must be valid email format
- Unique across all users

---

## Quick Test Commands

```bash
# Set base URL
BASE_URL="http://localhost:3000/api/v1"

# Register
curl -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","role":"USER"}'

# Login (save token)
TOKEN=$(curl -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","role":"USER"}' \
  | jq -r '.accessToken')

# Create Todo
curl -X POST $BASE_URL/todos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","description":"Description"}'

# Get Todos
curl -X GET $BASE_URL/todos \
  -H "Authorization: Bearer $TOKEN"
```

---

**Base URL:** `http://localhost:3000/api/v1`  
**Version:** v1  
**Format:** JSON