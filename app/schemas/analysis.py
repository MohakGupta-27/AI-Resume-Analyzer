from pydantic import BaseModel
from datetime import datetime


class AnalysisRequest(BaseModel):
    resume_id: int
    job_description_id: int | None = None


class AnalysisResponse(BaseModel):
    id: int
    resume_id: int
    job_description_id: int | None
    score: float | None
    matched_skills: list[str] | None
    missing_skills: list[str] | None
    suggestions: list[str] | None
    created_at: datetime

    class Config:
        from_attributes = True