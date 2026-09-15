# app/services/resume_service.py
import os
import shutil
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from app.config import settings
from app.repositories.resume_repository import (
    create_resume,
    update_extracted_text,
    get_resumes_by_user,
    get_resume_by_id,
)
from app.utils.text_extraction import extract_text_from_pdf

ALLOWED_EXTENSIONS = {".pdf"}


def save_uploaded_resume(db: Session, user_id: int, file: UploadFile):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported right now",
        )

    os.makedirs(settings.upload_dir, exist_ok=True)
    safe_filename = f"user_{user_id}_{file.filename}"
    destination_path = os.path.join(settings.upload_dir, safe_filename)

    with open(destination_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume = create_resume(
        db, user_id=user_id, file_name=file.filename, file_path=destination_path
    )

    extracted_text = extract_text_from_pdf(destination_path)
    resume = update_extracted_text(db, resume, extracted_text)

    return resume


def list_user_resumes(db: Session, user_id: int):
    return get_resumes_by_user(db, user_id)


def get_resume_or_404(db: Session, resume_id: int, user_id: int):
    resume = get_resume_by_id(db, resume_id)
    if not resume or resume.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return resume