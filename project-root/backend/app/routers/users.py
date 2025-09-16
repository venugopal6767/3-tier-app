from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .. import schemas, crud, database
from datetime import timedelta

router = APIRouter(prefix="/users", tags=["users"])
security = HTTPBearer()

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        crud.log_event(db, user_id=None, event_type="register", status=False)
        raise HTTPException(status_code=400, detail="Username already registered")
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        crud.log_event(db, user_id=None, event_type="register", status=False)
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = crud.create_user(db, user)
    crud.log_event(db, user_id=new_user.id, event_type="register", status=True)
    return new_user

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = crud.authenticate_user(db, user.username, user.password)
    if not db_user:
        crud.log_event(db, user_id=None, event_type="login", status=False)
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=crud.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = crud.create_access_token(data={"sub": db_user.username}, expires_delta=access_token_expires)
    crud.log_event(db, user_id=db_user.id, event_type="login", status=True)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserOut)
def read_users_me(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(database.get_db)):
    current_user = crud.get_current_user(db, credentials.credentials)
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return current_user