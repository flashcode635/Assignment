# API Documentation

---

## Authentication Endpoints

### 1. Register User
**Endpoint:** `/auth/register`  
**Method:** `POST`  
**Auth Protected:** ❌ No

#### Request Schema
```json
{
  "email": "string (valid email)",
  "password": "string (min 8 chars, 1 uppercase, 1 lowercase, 1 number)",
  "role": "USER | ADMIN (optional, defaults to USER)"
}
```

#### Sample Request
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "role": "USER"
}
```

#### Success Response (201)
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "cm5abc123xyz",
    "email": "john.doe@example.com",
    "role": "USER",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Responses
```json
// 400 - User Already Exists
{
  "error": "User with this email already exists",
  "code": "USER_EXISTS",
  "statusCode": 400
}

// 400 - Validation Error
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "statusCode": 400,
  "details": [
    "Password must be at least 8 characters long"
  ]
}
```

---

### 2. Login User
**Endpoint:** `/auth/login`  
**Method:** `POST`  
**Auth Protected:** ❌ No

#### Request Schema
```json
{
  "email": "string (valid email)",
  "password": "string",
  "role": "USER | ADMIN (required)"
}
```

#### Sample Request
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "role": "USER"
}
```

#### Success Response (200)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cm5abc123xyz",
    "email": "john.doe@example.com",
    "role": "USER"
  }
}
```

**Note:** `refreshToken` is set as an **httpOnly cookie** (not in response body)

#### Error Responses
```json
// 401 - Invalid Credentials
{
  "error": "Invalid email or password",
  "code": "UNAUTHORIZED",
  "statusCode": 401
}
```

---

### 3. Refresh Access Token
**Endpoint:** `/auth/refresh`  
**Method:** `POST`  
**Auth Protected:** ✅ Yes (Refresh Token via Cookie)

#### Request Schema
```
No request body required.
Refresh token is read from httpOnly cookie.
```

#### Success Response (200)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Note:** New `refreshToken` is set as an **httpOnly cookie** (Token Rotation)

#### Error Responses
```json
// 401 - No Refresh Token
{
  "error": "No refresh token provided",
  "code": "UNAUTHORIZED",
  "statusCode": 401
}

// 401 - Invalid/Expired Token
{
  "error": "Invalid token. Please login again.",
  "code": "UNAUTHORIZED",
  "statusCode": 401
}
```

---

### 4. Logout User
**Endpoint:** `/auth/logout`  
**Method:** `POST`  
**Auth Protected:** ✅ Yes (Refresh Token via Cookie)

#### Request Schema
```
No request body required.
```

#### Success Response (200)
```json
{
  "message": "Logged out successfully"
}
```

**Note:** Refresh token cookie is cleared and database hash is invalidated

---

## Todo Endpoints

### 5. Get All Todos
**Endpoint:** `/todos`  
**Method:** `GET`  
**Auth Protected:** ✅ Yes (Bearer Token)

#### Headers
```
Authorization: Bearer <accessToken>
```

#### Success Response (200)
```json
{
  "tasks": [
    {
      "id": "cm5task123",
      "title": "Complete project documentation",
      "description": "Write comprehensive API docs",
      "isCompleted": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "cm5task456",
      "title": "Review pull requests",
      "description": null,
      "isCompleted": true,
      "createdAt": "2024-01-14T08:20:00.000Z",
      "updatedAt": "2024-01-15T09:15:00.000Z"
    }
  ]
}
```

#### Error Responses
```json
// 401 - Unauthorized
{
  "error": "Invalid or expired access token",
  "code": "UNAUTHORIZED",
  "statusCode": 401
}
```

---

### 6. Create Todo
**Endpoint:** `/todos`  
**Method:** `POST`  
**Auth Protected:** ✅ Yes (Bearer Token)

#### Headers
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

#### Request Schema
```json
{
  "title": "string (required, max 255 chars)",
  "description": "string (optional, max 5000 chars)"
}
```

#### Sample Request
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs with examples"
}
```

#### Success Response (201)
```json
{
  "task": {
    "id": "cm5task123",
    "title": "Complete project documentation",
    "description": "Write comprehensive API docs with examples",
    "isCompleted": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Error Responses
```json
// 400 - Validation Error
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "statusCode": 400,
  "details": [
    "Title is required"
  ]
}
```

---

### 7. Update Todo
**Endpoint:** `/todos/{id}`  
**Method:** `PATCH`  
**Auth Protected:** ✅ Yes (Bearer Token)

#### Headers
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

#### URL Parameters
- `id` (string, required) - Task ID

#### Request Schema
```json
{
  "title": "string (optional, max 255 chars)",
  "description": "string (optional, max 5000 chars, nullable)",
  "isCompleted": "boolean (optional)"
}
```

**Note:** At least one field must be provided

#### Sample Request
```json
{
  "title": "Updated task title",
  "isCompleted": true
}
```

#### Success Response (200)
```json
{
  "task": {
    "id": "cm5task123",
    "title": "Updated task title",
    "description": "Write comprehensive API docs with examples",
    "isCompleted": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

#### Error Responses
```json
// 404 - Task Not Found
{
  "error": "Task not found",
  "code": "NOT_FOUND",
  "statusCode": 404
}

// 403 - Forbidden
{
  "error": "Forbidden: You can only update your own tasks",
  "code": "FORBIDDEN",
  "statusCode": 403
}

// 400 - Validation Error
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "statusCode": 400,
  "details": [
    "At least one field must be provided for update"
  ]
}
```

---

### 8. Delete Todo
**Endpoint:** `/todos/{id}`  
**Method:** `DELETE`  
**Auth Protected:** ✅ Yes (Bearer Token)

#### Headers
```
Authorization: Bearer <accessToken>
```

#### URL Parameters
- `id` (string, required) - Task ID

#### Success Response (200)
```json
{
  "message": "Task deleted successfully"
}
```

#### Error Responses
```json
// 404 - Task Not Found
{
  "error": "Task not found",
  "code": "NOT_FOUND",
  "statusCode": 404
}

// 403 - Forbidden
{
  "error": "Forbidden: You can only delete your own tasks",
  "code": "FORBIDDEN",
  "statusCode": 403
}
```

---

## User Management Endpoints

### 9. Get All Users (Admin Only)
**Endpoint:** `/users`  
**Method:** `GET`  
**Auth Protected:** ✅ Yes (Bearer Token + Admin Role)

#### Headers
```
Authorization: Bearer <accessToken>
```

**Note:** Only users with `ADMIN` role can access this endpoint

#### Success Response (200)
```json
{
  "users": [
    {
      "id": "cm5user123",
      "email": "john.doe@example.com",
      "role": "USER",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "_count": {
        "tasks": 5
      }
    },
    {
      "id": "cm5user456",
      "email": "admin@example.com",
      "role": "ADMIN",
      "createdAt": "2024-01-14T08:20:00.000Z",
      "updatedAt": "2024-01-14T08:20:00.000Z",
      "_count": {
        "tasks": 0
      }
    }
  ]
}
```

#### Error Responses
```json
// 401 - Unauthorized
{
  "error": "Invalid or expired access token",
  "code": "UNAUTHORIZED",
  "statusCode": 401
}

// 403 - Forbidden (Non-Admin)
{
  "error": "Access denied: Admin role required",
  "code": "FORBIDDEN",
  "statusCode": 403
}
```

---

## Authentication Flow

### Initial Login
1. **Register:** `POST /auth/register` → Returns user object
2. **Login:** `POST /auth/login` → Returns `accessToken` + sets `refreshToken` cookie
3. **Access Protected Routes:** Include `Authorization: Bearer <accessToken>` header

### Token Refresh (When Access Token Expires)
1. **Refresh:** `POST /auth/refresh` → Returns new `accessToken` + rotates `refreshToken`
2. **Continue:** Use new access token for subsequent requests

### Logout
1. **Logout:** `POST /auth/logout` → Clears cookie + invalidates refresh token in DB

---

## Security Features

### Token Details
- **Access Token:** 
  - Expires in 15 minutes
  - JWT stored in client (localStorage/memory)
  - Contains: `userId`, `role`
  
- **Refresh Token:**
  - Expires in 7 days
  - httpOnly cookie (XSS protection)
  - Hashed in database (theft detection)
  - Rotated on each refresh (prevents reuse)

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Hashed using bcrypt (12 rounds)

### Authorization Levels
- **Public:** Register, Login
- **Authenticated:** Todos (own resources only)
- **Admin:** User management endpoints

---

## Common Error Format

All errors follow this structure:
```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "statusCode": 400,
  "details": [] // Optional: validation errors
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Testing with cURL

### Register & Login
```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","role":"USER"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","role":"USER"}' \
  -c cookies.txt

# Get Todos (use access token from login response)
curl -X GET http://localhost:3000/api/v1/todos \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Create Todo
curl -X POST http://localhost:3000/api/v1/todos \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Task description"}'

# Update Todo
curl -X PATCH http://localhost:3000/api/v1/todos/TASK_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"isCompleted":true}'

# Delete Todo
curl -X DELETE http://localhost:3000/api/v1/todos/TASK_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Refresh Token
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -b cookies.txt

# Logout
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -b cookies.txt
```

---

## Rate Limiting (Production)

| Endpoint | Rate Limit |
|----------|------------|
| `/auth/login` | 5 requests/minute per IP |
| `/auth/register` | 3 requests/hour per IP |
| `/todos/*` | 100 requests/minute per user |
| `/users` | 20 requests/minute per admin |

---

**Last Updated:** January 2024  
**API Version:** v1