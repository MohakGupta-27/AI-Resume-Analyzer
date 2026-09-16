# ResumeLens frontend

React + TypeScript UI for the FastAPI AI Resume Analyzer.

## Run locally

1. Start the backend from `backend/` (`uvicorn app.main:app --reload`).
2. Copy `.env.example` to `.env` if you need a custom API URL. Default is `http://127.0.0.1:8000`.
3. From this folder:

```bash
npm install
npm run dev
```

The app expects the API at port 8000 and the UI at port 5173.
