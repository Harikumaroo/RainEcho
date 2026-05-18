# Rainecho — Weather Dashboard

A Django REST API backend with a React (Vite) frontend. This repository contains a weather dashboard application divided into `backend/` (Django + DRF) and `frontend/` (React + Axios). This README explains local setup, production-ready settings, and step-by-step deployment using free tiers: Render (backend) and Vercel (frontend).

## Project structure (top-level)
- `backend/` — Django project (contains `manage.py`, `requirements.txt`).
- `frontend/` — React app built with Vite (contains `package.json`, `src/`).
- `rainecho/` — Django project package (settings, wsgi, asgi)

## Quick overview
- Frontend: built and deployed to Vercel as static assets.
- Backend: deployed to Render as a Python web service running Gunicorn.
- Communication: Frontend calls backend REST API over HTTPS (CORS configured).

---

## Local development (quick)

1. Backend (Windows PowerShell example)

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt  # if already present
# or install development deps:
pip install django djangorestframework django-cors-headers
python manage.py migrate
python manage.py runserver
```

2. Frontend

```bash
cd frontend
npm ci
npm run dev   # Vite dev server, usually on port 5173
```

3. Open UI and API
- Frontend dev: `http://localhost:5173`
- Backend dev: `http://localhost:8000`

---

## Prepare backend for production (files and commands)

1. Create/verify `requirements.txt` in `backend/`:

```bash
# from backend/
python -m venv .venv
.venv\Scripts\Activate.ps1  # or source .venv/bin/activate on mac/linux
pip install --upgrade pip
pip install django djangorestframework gunicorn whitenoise dj-database-url psycopg2-binary django-cors-headers
pip freeze > requirements.txt
```

2. Create `Procfile` (backend root `backend/Procfile`):

```
web: gunicorn rainecho.wsgi:application --bind 0.0.0.0:$PORT
```

3. Create `runtime.txt` (backend root `backend/runtime.txt`) with the Python version:

```
python-3.11.4
```

4. Add WhiteNoise, Gunicorn and CORS to `settings.py` — example snippet to paste into `rainecho/rainecho/settings.py` (replace or integrate with your file):

```python
import os
from pathlib import Path
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-key")
DEBUG = os.environ.get("DEBUG", "False") == "True"
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "localhost").split(",")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    # your apps
    "application",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

# Database (use DATABASE_URL env var in production)
DATABASES = {
    "default": dj_database_url.parse(
        os.environ.get("DATABASE_URL", f"sqlite:///{BASE_DIR / 'db.sqlite3'}")
    )
}

# Static files (WhiteNoise)
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# CORS
CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",")

# Security behind proxies
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

```

Notes:
- Set `application` to your actual Django app name(s).
- Do not commit real `SECRET_KEY`.

---

## Environment variables (what to set on Render / Vercel)

Backend (Render service environment):
- `SECRET_KEY` — random strong string
- `DEBUG` — `False`
- `ALLOWED_HOSTS` — e.g. `rainecho-backend.onrender.com`
- `DATABASE_URL` — Postgres URL (use Render managed DB) or a production DB URL
- `CORS_ALLOWED_ORIGINS` — comma-separated allowed origins, e.g. `https://<your-frontend>.vercel.app`

Frontend (Vercel environment):
- `VITE_API_URL` — e.g. `https://<your-backend>.onrender.com`

Local `.env` (do not commit): keep local development values.

---

## Build & Deploy commands for Render (backend)

- Build Command (Render dashboard):

```
pip install -r requirements.txt
python manage.py migrate --noinput
python manage.py collectstatic --noinput
```

- Start Command (Render dashboard or `Procfile`):

```
gunicorn rainecho.wsgi:application --bind 0.0.0.0:$PORT
```

Notes: Render runs a build step and then starts the service using the Start Command.

---

## Vercel (frontend) settings

1. Connect your GitHub repo in Vercel and set the Root Directory to `frontend`.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Add Environment Variable `VITE_API_URL` = `https://<your-backend>.onrender.com` (set after backend URL exists).

---

## How to update the React API URL (Vite)

In your frontend code (example `frontend/src/api/weatherApi.js`):

```js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const api = axios.create({ baseURL: API_BASE, headers: { "Content-Type": "application/json" } });
export default api;
```

Build on Vercel will use `VITE_API_URL` to bake the production API URL into the built assets.

---

## After first deploy: run migrations

If you didn't run migrations in the build step, run them via Render's shell or the dashboard command:

```
python manage.py migrate
```

Create a superuser if needed:

```
python manage.py createsuperuser
```

---

## Redeploying after changes

1. Make changes locally.
2. Commit and push to GitHub:

```bash
git add .
git commit -m "Describe change"
git push origin main
```

3. Vercel and Render automatically redeploy on GitHub pushes (to configured branch). You can also trigger redeploys from their dashboards.

---

## Common troubleshooting

- 500 Errors on Render: check Render logs for missing env vars or database errors.
- CORS blocked requests: ensure `CORS_ALLOWED_ORIGINS` contains your Vercel origin.
- `ALLOWED_HOSTS` errors: ensure backend `ALLOWED_HOSTS` includes Render service URL.
- `collectstatic` fails: run locally to reproduce, check `STATICFILES_DIRS` and static file references.
- `psycopg2` compile errors: use `psycopg2-binary` in `requirements.txt`.
- Database connection refused: verify `DATABASE_URL` and managed DB.

---

## Free hosting limitations

- Render free tier: limited CPU/RAM, sleeping instances, limited outbound bandwidth, and limited managed DB tiers.
- Vercel free tier: limited build minutes, bandwidth and serverless function execution limits.

These limitations mean small projects and demos are fine, but production traffic will need paid plans.

---

## How frontend and backend communicate after deployment

- Frontend (Vercel) makes HTTPS requests to Backend (Render) using the `VITE_API_URL` base.
- Backend must allow the frontend origin via CORS and have `ALLOWED_HOSTS` set to the Render host.

---

## Next steps I can take for you

- Add `Procfile` and `runtime.txt` to `backend/`.
- Patch `rainecho/rainecho/settings.py` with the exact snippet above.
- Update a frontend API file to use `VITE_API_URL`.
- Generate a `requirements.txt` sample for you.

If you want me to make any of those edits now, tell me which one and I'll apply the change.
# RainEcho Weather Forecast Platform

A premium full-stack weather forecast platform built with Django + DRF backend and React + Vite frontend.

## Backend Setup

1. Open a terminal in `g:/rainecho/backend`
2. Create a Python virtual environment and activate it:
   - `python -m venv .venv`
   - `./.venv/Scripts/Activate.ps1` (PowerShell)
3. Install dependencies:
   - `pip install -r requirements.txt`
4. Add your OpenWeatherMap API key to `backend/.env`:
   - `OPENWEATHER_API_KEY=your_api_key_here`
5. Run migrations:
   - `python manage.py migrate`
6. Start the backend server:
   - `python manage.py runserver`

### API Endpoints

- `GET /api/weather/<city>/`
- `GET /api/forecast/<city>/`

## Frontend Setup

1. Open a terminal in `g:/rainecho/frontend`
2. Install dependencies:
   - `npm install`
3. Start the React app:
   - `npm run dev`
4. The frontend will use the backend at `http://localhost:8000/api`

## Features

- City search with error handling
- Current weather details
- 5-day weather forecast
- Animated backgrounds and glassmorphism cards
- Responsive mobile-first design
- Real-time clock and date display
- Smooth page transitions with Framer Motion
- Django REST API powered by OpenWeatherMap
