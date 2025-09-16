from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from prometheus_client import Counter, Gauge, generate_latest
from .database import get_db
from .crud import (
    get_registrations_count,
    get_logins_count,
    get_tasks_created_count,
    get_tasks_updated_count,
    get_tasks_deleted_count,
    get_events_count
)

router = APIRouter(prefix="/metrics", tags=["metrics"])

# Define Prometheus metrics
registrations_total = Gauge('registrations_total', 'Total number of user registrations')
logins_total = Counter('logins_total', 'Total number of successful logins')
tasks_created_total = Counter('tasks_created_total', 'Total number of tasks created')
tasks_updated_total = Counter('tasks_updated_total', 'Total number of tasks updated')
tasks_deleted_total = Counter('tasks_deleted_total', 'Total number of tasks deleted')
events_total = Gauge('events_total', 'Total number of events logged')

@router.get("/")
def get_metrics(db: Session = Depends(get_db)):
    registrations_total.set(get_registrations_count(db))
    logins_total.inc(get_logins_count(db))
    tasks_created_total.inc(get_tasks_created_count(db))
    tasks_updated_total.inc(get_tasks_updated_count(db))
    tasks_deleted_total.inc(get_tasks_deleted_count(db))
    events_total.set(get_events_count(db))
    return generate_latest()