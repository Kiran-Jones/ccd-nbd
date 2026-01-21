# Dartmouth Center for Career Design - Narrative By Design Resume Analyzer

A web application that helps users explore their professional identity by analyzing resume content. Users upload a resume, review extracted bullet points, and categorize their experiences into meaningful groups (Interests, Skills, Values, Strengths).

## Project Structure

- `frontend/` - React + TypeScript application (Vite)
- `backend/` - Python API for resume parsing

## Running Locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend runs on `http://localhost:5173` and expects the backend at `http://localhost:8000`.

## Deployment

**Live Site:** https://ccd-nbd.vercel.app/

**Backend API:** https://ccd-nbd.onrender.com/


