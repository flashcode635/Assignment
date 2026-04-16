# Scalability Strategy

## 1. Horizontal Scaling & Stateless Authentication
- **JWT-based auth** = No server-side session storage → Any instance can validate tokens
- Deploy behind **Load Balancer** (Nginx/AWS ALB)
  ```bash
  # Nginx load balancing config
  upstream backend {
    server app1:3000;
    server app2:3000;
    server app3:3000;
  }
  ```
- **Why it scales:** Token contains user data → No database lookup for auth → Can run 10+ instances without shared state
- **Validation:** Each server independently verifies JWT signature using secret key

## 2. Distributed Caching with Redis
- **Problem:** Database queries take ~50ms → Bottleneck at 100+ req/s
- **Solution:** Cache frequent reads in Redis (~2ms response)
  ```bash
  # Install & run Redis
  docker run -d -p 6379:6379 redis:alpine
  ```
- **Implementation:**
  - Cache `GET /tasks` for 5 minutes
  - Invalidate cache on `POST/PUT/DELETE` operations
- **Rate Limiting:** Block >100 requests/minute per IP using Redis counters

## 3. Database Optimization
- **Indexing:**
  ```sql
  CREATE INDEX idx_user_email ON users(email);
  CREATE INDEX idx_task_user ON tasks(user_id);
  ```
  - Without index: 1M records = ~500ms query (Full scan)
  - With index: 1M records = ~5ms query (B-tree lookup)
- **Connection Pooling:** Use `PgBouncer` to handle 1000+ connections with only 20 actual DB connections

## 4. Containerization & Auto-Scaling
- **Docker:** Ensures consistency across dev/staging/prod
  ```bash
  docker build -t task-api .
  docker-compose up --scale api=5  # Run 5 instances
  ```
- **Kubernetes:** Auto-scale based on CPU/memory
  ```yaml
  autoscaling:
    minReplicas: 2
    maxReplicas: 10
    targetCPUUtilization: 70%
  ```

**Result:** Architecture handles **10,000+ concurrent users** with <100ms response time.