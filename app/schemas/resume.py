# app/schemas/resume.py
from pydantic import BaseModel, model_validator
from datetime import datetime


def _from_resume_model(data, include_text: bool):
    if hasattr(data, "extracted_text"):
        payload = {
            "id": data.id,
            "file_name": data.file_name,
            "uploaded_at": data.uploaded_at,
            "has_extracted_text": bool(data.extracted_text and data.extracted_text.strip()),
        }
        if include_text:
            payload["extracted_text"] = data.extracted_text
        return payload
    return data


class ResumeResponse(BaseModel):
    id: int
    file_name: str
    uploaded_at: datetime
    has_extracted_text: bool = False

    @model_validator(mode="before")
    @classmethod
    def from_orm_resume(cls, data):
        return _from_resume_model(data, include_text=False)

    class Config:
        from_attributes = True


class ResumeDetailResponse(BaseModel):
    id: int
    file_name: str
    uploaded_at: datetime
    has_extracted_text: bool = False
    extracted_text: str | None = None

    @model_validator(mode="before")
    @classmethod
    def from_orm_resume_detail(cls, data):
        return _from_resume_model(data, include_text=True)

    class Config:
        from_attributes = True
