from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from . import database, models, schemas, routers, metrics
import secrets

app = FastAPI()
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://your-domain.com"],
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
    if request.method in ["POST", "PUT", "DELETE"]:
        csrf_token = request.headers.get("X-CSRF-Token")
        if not csrf_token or not csrf_tokens.get(csrf_token):
            raise HTTPException(status_code=403, detail="Invalid CSRF token")
        del csrf_tokens[csrf_token]  # One-time use
    response = await call_next(request)
    return response

app.include_router(routers.users.router)
app.include_router(routers.tasks.router)
app.include_router(metrics.router)