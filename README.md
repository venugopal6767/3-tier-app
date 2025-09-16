# Three-tier Sample App

This repository contains a sample 3-tier application:

- Frontend: React single-page app (register, login, todos)
- Backend: Node.js + Express REST API, connects to PostgreSQL
- Database: PostgreSQL with initialization SQL
- Docker: Separate Dockerfiles and a docker-compose.yml
- CI: GitHub Actions workflow (.github/workflows/ci.yml)

## Quick run (requires Docker + docker-compose)

1. Build and run:
   ```bash
   docker-compose up --build
   ```
2. Open the frontend at: http://localhost:3000
   - Note: frontend communicates with `backend:3000` internally in Docker network.

3. Default DB:
   - Postgres username: postgres
   - Postgres password: postgres
   - Database: appdb

## Files
See the project folders: `frontend/`, `backend/`, `db/`.
