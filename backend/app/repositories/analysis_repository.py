# app/repositories/analysis_repository.py
from sqlalchemy.orm import Session
from app.models.analysis import Analysis


def create_analysis(
    db: Session,
    resume_id: int,
    job_description_id: int | None,
    score: float,
    matched_skills: list,
    missing_skills: list,
    suggestions: list,
    raw_ai_response: str,
) -> Analysis:
    analysis = Analysis(
        resume_id=resume_id,
        job_description_id=job_description_id,
        score=score,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        suggestions=suggestions,
        raw_ai_response=raw_ai_response,
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis


def get_analyses_by_resume(db: Session, resume_id: int) -> list[Analysis]:
    return (
        db.query(Analysis)
        .filter(Analysis.resume_id == resume_id)
        .order_by(Analysis.created_at.desc())
        .all()
    )


def get_analyses_by_user(db: Session, user_id: int) -> list[Analysis]:
    from app.models.resume import Resume

    return (
        db.query(Analysis)
        .join(Resume, Analysis.resume_id == Resume.id)
        .filter(Resume.user_id == user_id)
        .order_by(Analysis.created_at.desc())
        .all()
    )


def get_analysis_by_id(db: Session, analysis_id: int) -> Analysis | None:
    return db.query(Analysis).filter(Analysis.id == analysis_id).first()