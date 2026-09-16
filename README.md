# AI Resume Analyzer

FastAPI backend plus a React TypeScript frontend (ResumeLens).

## Backend

From `backend/`:

1. Create a `.env` from `.env.example` (Postgres URL, `SECRET_KEY`, `GROQ_API_KEY`).
2. Install dependencies and run migrations.
3. Start the API:

```bash
uvicorn app.main:app --reload
```

The API runs at `http://127.0.0.1:8000`.

## Frontend

From `frontend/`:

```bash
npm install
npm run dev
```

The UI runs at `http://localhost:5173` and calls the FastAPI backend. Copy `frontend/.env.example` to `frontend/.env` if the API is not on port 8000.
