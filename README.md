# Three-tier Sample App (Production-ready configuration)


This repository contains a production-friendly 3-tier application:


- Frontend: React app served by Nginx, with `/api` proxied to backend
- Backend: Node.js + Express, Prometheus metrics at `/metrics`
- Database: PostgreSQL with initial schema
- Docker: Dockerfiles + docker-compose


## Files added/changed for production

- `frontend/nginx.conf` now proxies `/api` to the backend service.
- `frontend/src/api.js` uses relative paths by default so the browser hits the same origin.
- `.env` files added (root, backend/.env, frontend/.env) and `docker-compose.yml` updated to use them.

## Run locally (production-like)

1. Build and start:
```bash
docker-compose up --build -d
```

2. Open the frontend in your browser at:
- `http://localhost:3000`

3. The frontend will call backend APIs at `/api/...` which Nginx will proxy to `backend:3000` inside Docker.
   You do NOT need the frontend to call `http://backend:3000` directly from your browser.

4. Metrics endpoint (Prometheus format):
- `http://localhost:3000/metrics` is proxied to backend's `/metrics` via nginx (use `http://localhost:3000/metrics`).
  (Note: nginx /api proxy includes /metrics if you request `/metrics` directly. If not, use `http://localhost:4000/metrics`.)

## Environment files

- `./.env` — database credentials used by Postgres container
- `./backend/.env` — backend service environment (DB connection, PORT)
- `./frontend/.env` — frontend overrides (e.g., `REACT_APP_API_URL` if you prefer absolute URL)

## Notes

- In this configuration the frontend and backend communicate via the Docker internal network. The browser communicates with the frontend (nginx) which proxies API calls to the backend. This avoids the need for `localhost` hostnames inside built frontend assets.

- For a true production deployment, consider:
  * Storing secrets in a secret manager instead of `.env`
  * Disabling backend port exposure to host (remove `ports` mapping) and keep everything behind a load balancer
  * Using TLS certificates (Let's Encrypt) at the reverse proxy

## Cleaning up
```bash
docker-compose down -v
```

