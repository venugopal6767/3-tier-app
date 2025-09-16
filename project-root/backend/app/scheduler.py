from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.sqlalchemy import SQLAlchemyJobStore
from .database import SQLALCHEMY_DATABASE_URL, SessionLocal
from . import models
from datetime import datetime

scheduler = BackgroundScheduler({
    'apscheduler.jobstores.default': {
        'type': 'sqlalchemy',
        'url': SQLALCHEMY_DATABASE_URL
    }
})
scheduler.start()

def schedule_task(task_id: int, scheduled_time: datetime):
    def log_task_event():
        db = SessionLocal()
        try:
            db_event = models.Event(
                user_id=None,
                event_type=f"task_scheduled_{task_id}",
                event_time=datetime.now(scheduled_time.tzinfo),
                status=True
            )
            db.add(db_event)
            db.commit()
        finally:
            db.close()

    scheduler.add_job(
        log_task_event,
        trigger='date',
        run_date=scheduled_time,
        id=f"task_{task_id}",
        replace_existing=True
    )