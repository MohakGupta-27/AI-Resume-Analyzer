# app/services/job_description_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.job_description_repository import (
    count_job_descriptions_by_user,
    create_job_description,
    get_job_descriptions_by_user,
    get_job_description_by_id,
    delete_job_description,
)
from app.schemas.job_description import JobDescriptionCreate


def add_job_description(db: Session, user_id: int, data: JobDescriptionCreate):
    return create_job_description(db, user_id, data.title, data.description_text)


def list_job_descriptions(db: Session, user_id: int,skip: int, limit: int):
    items = get_job_descriptions_by_user(db, user_id, skip, limit)
    total = count_job_descriptions_by_user(db, user_id)
    return {"items": items, "total": total, "skip": skip, "limit": limit}


def get_job_description_or_404(db: Session, job_description_id: int, user_id: int):
    job_description = get_job_description_by_id(db, job_description_id)
    if not job_description or job_description.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found")
    return job_description


def remove_job_description(db: Session, job_description_id: int, user_id: int):
    job_description = get_job_description_or_404(db, job_description_id, user_id)
    delete_job_description(db, job_description)