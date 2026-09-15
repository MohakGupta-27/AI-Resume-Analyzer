# app/schemas/job_description.py
from pydantic import BaseModel
from datetime import datetime


class JobDescriptionCreate(BaseModel):
    title: str | None = None
    description_text: str


class JobDescriptionResponse(BaseModel):
    id: int
    title: str | None
    description_text: str
    created_at: datetime

    class Config:
        from_attributes = True