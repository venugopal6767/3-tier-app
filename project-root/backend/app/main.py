from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from . import database, models, schemas, routers, metrics
import secrets
import structlog

structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.stdlib.add_log_level,
        structlog.processors.JSONRenderer()
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
)
logger = structlog.get_logger()

app = FastAPI()
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update to your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

csrf_tokens = {}  # In-memory store; use Redis in production

@app.get("/csrf-token")
def get_csrf_token():
    token = secrets.token_hex(16)
    csrf_tokens[token] = True
    return {"csrf_token": token}

@app.middleware("http")
async def check_csrf_token(request: Request, call_next):
    logger.info("Request received", method=request.method, path=request.url.path, client=request.client.host)
    if request.method in ["POST", "PUT", "DELETE"]:
        csrf_token = request.headers.get("X-CSRF-Token")
        if not csrf_token or not csrf_tokens.get(csrf_token):
            logger.error("Invalid CSRF token", client=request.client.host)
            raise HTTPException(status_code=403, detail="Invalid CSRF token")
        del csrf_tokens[csrf_token]  # One-time use
    response = await call_next(request)
    logger.info("Response sent", status_code=response.status_code)
    return response

app.include_router(routers.users_router)
app.include_router(routers.tasks_router)
app.include_router(metrics.router)