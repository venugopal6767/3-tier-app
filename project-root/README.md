Todo App - 3-Tier Web Application

A 3-tier web application with a React frontend, FastAPI backend, and PostgreSQL database. Supports user registration, login, task CRUD operations, task scheduling, event logging, and Prometheus metrics.

Features





Frontend: React with Tailwind CSS, responsive design, form validation, React Router.



Backend: FastAPI with JWT authentication, APScheduler for task scheduling, event logging, Prometheus metrics.



Database: PostgreSQL with SQLAlchemy and Alembic migrations.



Monitoring: /metrics endpoint for Prometheus.

Prerequisites





Docker and Docker Compose



Node.js and npm (for local frontend dev without Docker)



Python 3.10+ (for local backend dev without Docker)

Setup Instructions

Step 1: Clone the Repository

git clone <repo-url>
cd <repo-dir>

Step 2: Set Up Environment

Create a .env file in the root directory:

DATABASE_URL=postgresql://user:password@db:5432/appdb
SECRET_KEY=your-secret-key-for-jwt  # Generate with: openssl rand -hex 32

For local dev without Docker, use SQLite by setting DATABASE_URL=sqlite:///./test.db.

Step 3: Run with Docker Compose





Build and start services:

docker-compose up --build





Access the app:





Frontend: http://localhost:3000



Backend: http://localhost:8000



Database: PostgreSQL on port 5432 (user: user, password: password, db: appdb)



Run migrations:

docker-compose exec backend alembic upgrade head

Step 4: Run Locally (Without Docker)





Database:





Install PostgreSQL or use SQLite.



Create database and user as per .env.



Backend:

cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload





Runs on http://localhost:8000





Frontend:

cd frontend
npm install
npm start





Runs on http://localhost:3000 (proxies to backend via package.json)

Step 5: Monitor the App





Metrics: http://localhost:8000/metrics



Metrics include: app_registrations_total, app_logins_total, app_tasks_created_total, app_tasks_updated_total, app_tasks_deleted_total, app_requests_total, app_successful_requests_total, app_failed_requests_total.

Step 6: Usage





Visit http://localhost:3000



Register a user.



Log in to view the dashboard (shows tasks, allows adding/scheduling tasks).



Actions (register, login, task operations) are logged automatically.



Scheduled tasks log events when their scheduled time is reached.

Troubleshooting





Ensure ports 3000, 8000, 5432 are free.



Check logs: docker-compose logs



For Alembic issues, reinitialize if needed: alembic init migrations

Code Structure





frontend/: React app



backend/: FastAPI app with migrations



docker-compose.yml: Container setup