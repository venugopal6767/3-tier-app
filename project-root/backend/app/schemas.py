from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    scheduled_time: datetime

class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    scheduled_time: datetime | None = None
    status: str | None = None

class TaskOut(BaseModel):
    id: int
    user_id: int
    title: str
    description: str | None
    scheduled_time: datetime
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class EventOut(BaseModel):
    id: int
    user_id: int | None
    event_type: str
    event_time: datetime
    status: bool

    class Config:
        from_attributes = True