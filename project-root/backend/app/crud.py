from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(username=user.username, email=user.email, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user or not pwd_context.verify(password, user.password_hash):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(db: Session, token: str):
    try:
        # Expect token in format "Bearer <token>"
        if token.startswith("Bearer "):
            token = token[len("Bearer "):]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
    except JWTError:
        return None
    user = get_user_by_username(db, username=username)
    return user

def create_task(db: Session, task: schemas.TaskCreate, user_id: int):
    db_task = models.Task(
        user_id=user_id,
        title=task.title,
        description=task.description,
        scheduled_time=task.scheduled_time,
        status="pending"
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_tasks(db: Session, user_id: int):
    return db.query(models.Task).filter(models.Task.user_id == user_id).all()

def get_task(db: Session, task_id: int, user_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == user_id).first()

def update_task(db: Session, task_id: int, user_id: int, task: schemas.TaskUpdate):
    db_task = get_task(db, task_id, user_id)
    if not db_task:
        return None
    for key, value in task.dict(exclude_unset=True).items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int, user_id: int):
    db_task = get_task(db, task_id, user_id)
    if not db_task:
        return False
    db.delete(db_task)
    db.commit()
    return True

def log_event(db: Session, user_id: int | None, event_type: str, status: bool = True):
    db_event = models.Event(user_id=user_id, event_type=event_type, status=status)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_registrations_count(db: Session):
    return db.query(models.User).count()

def get_logins_count(db: Session):
    return db.query(models.Event).filter(models.Event.event_type == "login", models.Event.status == True).count()

def get_tasks_created_count(db: Session):
    return db.query(models.Event).filter(models.Event.event_type == "task_create", models.Event.status == True).count()

def get_tasks_updated_count(db: Session):
    return db.query(models.Event).filter(models.Event.event_type == "task_update", models.Event.status == True).count()

def get_tasks_deleted_count(db: Session):
    return db.query(models.Event).filter(models.Event.event_type == "task_delete", models.Event.status == True).count()

def get_events_count(db: Session):
    return db.query(models.Event).count()