
# app/repositories/job_description_repository.py
from sqlalchemy.orm import Session
from app.models.job_description import JobDescription


def create_job_description(db: Session, user_id: int, title: str | None, description_text: str) -> JobDescription:
    job_description = JobDescription(user_id=user_id, title=title, description_text=description_text)
    db.add(job_description)
    db.commit()
    db.refresh(job_description)
    return job_description


def get_job_descriptions_by_user(db: Session, user_id: int,skip: int = 0, limit: int = 10) -> list[JobDescription]:
    return (
        db.query(JobDescription)
        .filter(JobDescription.user_id == user_id)
        .order_by(JobDescription.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_job_description_by_id(db: Session, job_description_id: int) -> JobDescription | None:
    return db.query(JobDescription).filter(JobDescription.id == job_description_id).first()


def delete_job_description(db: Session, job_description: JobDescription) -> None:
    db.delete(job_description)
    db.commit()

def count_job_descriptions_by_user(db: Session, user_id: int) -> int:
    return db.query(JobDescription).filter(JobDescription.user_id == user_id).count()