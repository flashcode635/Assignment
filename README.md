<![CDATA[<div align="center">

# ✅ Task Manager

A full-stack task management application with **secure JWT authentication**, **role-based access control (RBAC)**, and a polished UI — built with **Next.js 16**, **Prisma ORM**, and **PostgreSQL**.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-tsk--mangr.vercel.app-000?style=for-the-badge&logo=vercel)](https://tsk-mangr.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Live Deployment](#-live-deployment)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [API Endpoints](#-api-endpoints)
- [Repository Structure](#-repository-structure)
- [Authentication Flow](#-authentication-flow)
- [Scalability](#-scalability)
- [License](#-license)

---

## 🧐 About the Project

**Task Manager** is a full-stack web application that allows users to **create**, **read**, **update**, and **delete** tasks through both a beautiful frontend UI and a RESTful API. The application implements a complete authentication system with **access & refresh token rotation**, password hashing with **bcrypt**, and middleware-level **role-based access control**.

There are two roles:
- **USER** — Can manage their own tasks (CRUD operations).
- **ADMIN** — Can view all registered users and their task counts, in addition to managing their own tasks.

---

## ✨ Features

| Feature | Description |
|---|---|
| **JWT Authentication** | Access tokens (15 min) + Refresh tokens (7 days) with secure rotation |
| **Role-Based Access** | `USER` and `ADMIN` roles enforced at middleware & API level |
| **CRUD Tasks** | Create, list, update (title, description, status), and delete tasks |
| **Input Validation** | Request body validated with **Zod** schemas (auth & task payloads) |
| **Password Security** | Passwords hashed with **bcrypt** (12 salt rounds) |
| **Middleware Protection** | Next.js middleware intercepts protected routes, verifies JWTs, and injects user context |
| **Admin Dashboard** | Admin-only page to view all users and their task counts |
| **Refresh Token Rotation** | Old refresh tokens are invalidated on each use — stolen token detection built-in |
| **Error Handling** | Centralized error handler with structured JSON error responses |
| **Responsive UI** | Clean, modern frontend with Tailwind CSS v4 |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma 7](https://www.prisma.io/) with `@prisma/adapter-pg` |
| **Auth** | [jose](https://github.com/panva/jose) (JWT), [bcryptjs](https://www.npmjs.com/package/bcryptjs) |
| **Validation** | [Zod 4](https://zod.dev/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🌐 Live Deployment

The application is deployed and live at:

### 🔗 **[https://tsk-mangr.vercel.app/](https://tsk-mangr.vercel.app/)**

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm**, **yarn**, **pnpm**, or **bun**
- A **PostgreSQL** database (local or hosted, e.g., [Neon](https://neon.tech/), [Supabase](https://supabase.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/task-manager.git
   cd task-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp sample.env .env
   ```

   Then fill in your `.env` file (see [Environment Variables](#-environment-variables)).

4. **Generate Prisma client & run migrations**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory based on `sample.env`:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
| `JWT_SECRET` | Secret key for signing access tokens | `your-super-secret-key` |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens | `your-refresh-secret-key` |

```env
DATABASE_URL="your-postgresql-connection-string-here"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"
```

---

## 🗄 Database Setup

The project uses **Prisma ORM** with PostgreSQL. The schema defines two models:

### User

| Field | Type | Notes |
|---|---|---|
| `id` | `String` (CUID) | Primary key |
| `email` | `String` | Unique, indexed for fast login lookups |
| `passwordHash` | `String` | bcrypt hash |
| `role` | `Enum` (USER / ADMIN) | Defaults to `USER` |
| `refreshTokenHash` | `String?` | Stores hashed refresh token for rotation |
| `createdAt` | `DateTime` | Auto-set |
| `updatedAt` | `DateTime` | Auto-updated |

### Task

| Field | Type | Notes |
|---|---|---|
| `id` | `String` (CUID) | Primary key |
| `title` | `String` | Required |
| `description` | `String?` | Optional, stored as `Text` in Postgres |
| `isCompleted` | `Boolean` | Defaults to `false` |
| `userId` | `String` | Foreign key → User (cascade delete), indexed |
| `createdAt` | `DateTime` | Auto-set |
| `updatedAt` | `DateTime` | Auto-updated |

---

## 📡 API Endpoints

All API routes are versioned under `/api/v1`. Protected routes require a `Bearer <accessToken>` in the `Authorization` header.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | ❌ | Register a new user |
| `POST` | `/api/v1/auth/login` | ❌ | Login and receive tokens |
| `POST` | `/api/v1/auth/refresh` | 🍪 Cookie | Rotate refresh token and get new access token |
| `POST` | `/api/v1/auth/logout` | 🍪 Cookie | Invalidate refresh token and clear cookie |

### Tasks (Todos)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/todos` | 🔒 Bearer | Get all tasks for the logged-in user |
| `POST` | `/api/v1/todos` | 🔒 Bearer | Create a new task |
| `PATCH` | `/api/v1/todos/:id` | 🔒 Bearer | Update a task (title, description, isCompleted) |
| `DELETE` | `/api/v1/todos/:id` | 🔒 Bearer | Delete a task |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/users` | 🔒 Admin | List all users with task counts |

> 📄 **Full API documentation** with request/response examples is available in [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md)  
> ⚡ **Quick reference card** available at [`docs/API_QUICK_REFERENCE.md`](docs/API_QUICK_REFERENCE.md)  
> 📬 **Postman collection** available at [`docs/Postman_Collection.json`](docs/Postman_Collection.json)

---

## 🗂 Repository Structure

```
├── app/                          # Next.js App Router (pages + API)
│   ├── layout.tsx                # Root layout — sets fonts (Geist), global CSS, html/body
│   ├── page.tsx                  # Landing page — hero with Sign In / Create Account CTAs
│   ├── globals.css               # Global styles & Tailwind CSS imports
│   ├── favicon.ico               # App favicon
│   │
│   ├── (auth)/                   # Auth route group (no layout nesting)
│   │   ├── login/
│   │   │   └── page.tsx          # Login page — email/password form with role selection
│   │   └── register/
│   │       └── page.tsx          # Register page — sign-up form with validation feedback
│   │
│   ├── dashboard/
│   │   └── page.tsx              # User dashboard — task list with create/edit/delete/toggle
│   │
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard — view all users and their task counts
│   │
│   ├── api/v1/                   # Versioned REST API routes
│   │   ├── auth/
│   │   │   ├── register/
│   │   │   │   └── route.ts      # POST — register new user (validate, hash password, insert)
│   │   │   ├── login/
│   │   │   │   └── route.ts      # POST — authenticate user, issue access + refresh tokens
│   │   │   ├── refresh/
│   │   │   │   └── route.ts      # POST — rotate refresh token, issue new access token
│   │   │   └── logout/
│   │   │       └── route.ts      # POST — invalidate refresh token, clear cookie
│   │   ├── todos/
│   │   │   ├── route.ts          # GET (list user tasks) + POST (create task)
│   │   │   └── [id]/
│   │   │       └── route.ts      # PATCH (update task) + DELETE (delete task)
│   │   └── users/
│   │       └── route.ts          # GET — admin-only: list all users with task counts
│   │
│   └── generated/prisma/         # Auto-generated Prisma Client output
│
├── components/ui/                # Reusable UI components
│   ├── Button.tsx                # Button component — primary/secondary/danger/ghost variants with loading state
│   ├── Input.tsx                 # Input component — labeled text input with error display
│   └── Textarea.tsx              # Textarea component — labeled multi-line input with error display
│
├── hooks/
│   └── useAuth.ts                # Client-side auth hook — token decode, auto-refresh (14 min interval), logout
│
├── lib/                          # Server-side utilities & business logic
│   ├── prisma.ts                 # Prisma Client singleton — configured with @prisma/adapter-pg
│   ├── jwt.ts                    # JWT helpers — sign/verify access tokens (15 min) & refresh tokens (7 days)
│   ├── auth.ts                   # Auth guards — requireUser() and requireRole() for API routes
│   ├── api-handler.ts            # Centralized error handler — catches Zod, APIError, and unhandled exceptions
│   └── validations/
│       ├── auth.ts               # Zod schemas — registerSchema (email + strong password), loginSchema
│       └── task.ts               # Zod schemas — createTaskSchema, updateTaskSchema (partial update)
│
├── prisma/
│   ├── schema.prisma             # Database schema — User (roles, refresh token) & Task models with indexes
│   └── migrations/               # Prisma migration history
│
├── proxy.ts                      # Next.js middleware — JWT verification, RBAC guard, header injection for protected routes
│
├── docs/                         # API documentation
│   ├── API_DOCUMENTATION.md      # Full API docs with request/response examples
│   ├── API_QUICK_REFERENCE.md    # Quick reference card for all endpoints
│   └── Postman_Collection.json   # Importable Postman collection for testing
│
├── public/                       # Static assets (SVGs, icons)
├── SCALABILITY.md                # Scalability strategy document (horizontal scaling, Redis caching, DB optimization)
├── sample.env                    # Example environment variable file
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── prisma.config.ts              # Prisma CLI configuration (schema path, migration path, datasource URL)
├── postcss.config.mjs            # PostCSS config for Tailwind CSS
├── eslint.config.mjs             # ESLint configuration
└── .gitignore                    # Git ignore rules
```

---

## 🔄 Authentication Flow

```
┌─────────┐         ┌──────────┐         ┌──────────┐
│  Client  │         │ Middleware│         │ API Route│
└────┬─────┘         └────┬─────┘         └────┬─────┘
     │                     │                    │
     │  POST /auth/login   │                    │
     │────────────────────►│───────────────────►│
     │                     │                    │
     │                     │  Validate creds,   │
     │                     │  issue tokens      │
     │◄────────────────────│◄───────────────────│
     │  { accessToken }    │  Set refreshToken  │
     │  (in JSON body)     │  (httpOnly cookie)  │
     │                     │                    │
     │  GET /todos         │                    │
     │  Authorization:     │                    │
     │  Bearer <token>     │                    │
     │────────────────────►│                    │
     │                     │  Verify JWT        │
     │                     │  Inject x-user-id  │
     │                     │  Inject x-user-role│
     │                     │───────────────────►│
     │                     │                    │  Read headers,
     │                     │                    │  query DB
     │◄────────────────────│◄───────────────────│
     │  { tasks: [...] }   │                    │
     │                     │                    │
     │  POST /auth/refresh │                    │
     │  (cookie sent auto) │                    │
     │────────────────────►│───────────────────►│
     │                     │  Rotate tokens     │
     │◄────────────────────│◄───────────────────│
     │  { new accessToken }│  Set new cookie    │
```

**Key Security Details:**

- **Access Token** — Short-lived (15 min), stored in `localStorage`, sent via `Authorization: Bearer` header.
- **Refresh Token** — Long-lived (7 days), stored in an `httpOnly` + `secure` + `sameSite: strict` cookie, hashed in the database.
- **Token Rotation** — On every refresh, both tokens are reissued and the old refresh token hash is replaced. If a previously used token is detected, _all_ tokens for that user are invalidated (theft detection).
- **Middleware (proxy.ts)** — Runs at the Edge, verifies JWTs, enforces RBAC, and injects `x-user-id` / `x-user-role` headers so route handlers never touch raw tokens.

---

## 📈 Scalability

The architecture is designed to scale horizontally. Detailed strategies are documented in [`SCALABILITY.md`](SCALABILITY.md), covering:

- **Horizontal scaling** with stateless JWT auth (no server-side sessions)
- **Redis caching** for frequent reads with cache invalidation
- **Database optimization** with indexes and connection pooling (PgBouncer)
- **Containerization** with Docker & Kubernetes auto-scaling

---

## 📜 License

This project is created as part of a **Backend Intern Assignment**. Feel free to use it as a reference.

---

<div align="center">

**Built using Next.js, Prisma & PostgreSQL**

[Live Demo](https://tsk-mangr.vercel.app/) · [API Docs](docs/API_DOCUMENTATION.md) · [Report Bug](https://github.com/<your-username>/task-manager/issues)

</div>
]]>
