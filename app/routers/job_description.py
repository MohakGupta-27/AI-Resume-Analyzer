# app/routers/job_description.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.job_description import JobDescriptionCreate, JobDescriptionResponse
from app.services.job_description_service import (
    add_job_description,
    list_job_descriptions,
    get_job_description_or_404,
    remove_job_description,
)

router = APIRouter(prefix="/job-descriptions", tags=["Job Descriptions"])


@router.post("", response_model=JobDescriptionResponse)
def create(
    data: JobDescriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return add_job_description(db, current_user.id, data)


@router.get("", response_model=list[JobDescriptionResponse])
def list_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_job_descriptions(db, current_user.id)


@router.get("/{job_description_id}", response_model=JobDescriptionResponse)
def get_one(
    job_description_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_job_description_or_404(db, job_description_id, current_user.id)


@router.delete("/{job_description_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    job_description_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    remove_job_description(db, job_description_id, current_user.id)