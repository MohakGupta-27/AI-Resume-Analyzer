# app/services/analysis_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.repositories.resume_repository import get_resume_by_id
from app.repositories.analysis_repository import (
    create_analysis,
    get_analyses_by_resume,
    get_analyses_by_user,
    get_analysis_by_id,
)
from app.services.ai_service import call_ai_for_analysis


def run_analysis(db: Session, user_id: int, resume_id: int, job_description_id: int | None):
    resume = get_resume_by_id(db, resume_id)
    if not resume or resume.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    if not resume.extracted_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume has no extracted text to analyze",
        )

    job_description_text = None
    if job_description_id:
        from app.models.job_description import JobDescription
        job_description = (
            db.query(JobDescription)
            .filter(JobDescription.id == job_description_id, JobDescription.user_id == user_id)
            .first()
        )
        if not job_description:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job description not found")
        job_description_text = job_description.description_text

    ai_result = call_ai_for_analysis(resume.extracted_text, job_description_text)
    parsed = ai_result["parsed"]

    return create_analysis(
        db,
        resume_id=resume.id,
        job_description_id=job_description_id,
        score=parsed.get("score"),
        matched_skills=parsed.get("matched_skills", []),
        missing_skills=parsed.get("missing_skills", []),
        suggestions=parsed.get("suggestions", []),
        raw_ai_response=ai_result["raw"],
    )


def list_analyses_for_resume(db: Session, user_id: int, resume_id: int):
    resume = get_resume_by_id(db, resume_id)
    if not resume or resume.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return get_analyses_by_resume(db, resume_id)


def list_analyses_for_user(db: Session, user_id: int):
    return get_analyses_by_user(db, user_id)


def get_analysis_or_404(db: Session, analysis_id: int, user_id: int):
    analysis = get_analysis_by_id(db, analysis_id)
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")

    resume = get_resume_by_id(db, analysis.resume_id)
    if not resume or resume.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")
    return analysis