from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .. import schemas, crud, database, scheduler
from datetime import datetime

router = APIRouter(prefix="/tasks", tags=["tasks"])
security = HTTPBearer()

@router.post("/", response_model=schemas.TaskOut)
def create_task(task: schemas.TaskCreate, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(database.get_db)):
    current_user = crud.get_current_user(db, credentials.credentials)
    if not current_user:
        crud.log_event(db, user_id=None, event_type="task_create", status=False)
        raise HTTPException(status_code=401, detail="Invalid token")
    if task.scheduled_time < datetime.now(task.scheduled_time.tzinfo):
        crud.log_event(db, user_id=current_user.id, event_type="task_create", status=False)
        raise HTTPException(status_code=400, detail="Scheduled time must be in the future")
    db_task = crud.create_task(db, task, current_user.id)
    scheduler.schedule_task(db_task.id, db_task.scheduled_time)
    crud.log_event(db, user_id=current_user.id, event_type="task_create", status=True)
    return db_task

@router.get("/", response_model=list[schemas.TaskOut])
def get_tasks(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(database.get_db)):
    current_user = crud.get_current_user(db, credentials.credentials)
    if not current_user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return crud.get_tasks(db, current_user.id)

@router.put("/{task_id}", response_model=schemas.TaskOut)
def update_task(task_id: int, task: schemas.TaskUpdate, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(database.get_db)):
    current_user = crud.get_current_user(db, credentials.credentials)
    if not current_user:
        crud.log_event(db, user_id=None, event_type="task_update", status=False)
        raise HTTPException(status_code=401, detail="Invalid token")
    db_task = crud.update_task(db, task_id, current_user.id, task)
    if not db_task:
        crud.log_event(db, user_id=current_user.id, event_type="task_update", status=False)
        raise HTTPException(status_code=404, detail="Task not found")
    if task.scheduled_time and task.scheduled_time < datetime.now(task.scheduled_time.tzinfo):
        crud.log_event(db, user_id=current_user.id, event_type="task_update", status=False)
        raise HTTPException(status_code=400, detail="Scheduled time must be in the future")
    if task.scheduled_time:
        scheduler.schedule_task(db_task.id, db_task.scheduled_time)
    crud.log_event(db, user_id=current_user.id, event_type="task_update", status=True)
    return db_task

@router.delete("/{task_id}")
def delete_task(task_id: int, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(database.get_db)):
    current_user = crud.get_current_user(db, credentials.credentials)
    if not current_user:
        crud.log_event(db, user_id=None, event_type="task_delete", status=False)
        raise HTTPException(status_code=401, detail="Invalid token")
    success = crud.delete_task(db, task_id, current_user.id)
    if not success:
        crud.log_event(db, user_id=current_user.id, event_type="task_delete", status=False)
        raise HTTPException(status_code=404, detail="Task not found")
    crud.log_event(db, user_id=current_user.id, event_type="task_delete", status=True)
    return {"message": "Task deleted"}