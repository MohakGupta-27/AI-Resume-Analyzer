# app/repositories/resume_repository.py
from sqlalchemy.orm import Session
from app.models.resume import Resume


def create_resume(db: Session, user_id: int, file_name: str, file_path: str) -> Resume:
    resume = Resume(user_id=user_id, file_name=file_name, file_path=file_path)
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


def update_extracted_text(db: Session, resume: Resume, text: str) -> Resume:
    resume.extracted_text = text
    db.commit()
    db.refresh(resume)
    return resume


def get_resumes_by_user(db: Session, user_id: int ,skip: int = 0, limit: int = 10) -> list[Resume]:
    return (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .order_by(Resume.uploaded_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_resume_by_id(db: Session, resume_id: int) -> Resume | None:
    return db.query(Resume).filter(Resume.id == resume_id).first()

def count_resumes_by_user(db: Session, user_id: int) -> int:
    return db.query(Resume).filter(Resume.user_id == user_id).count()