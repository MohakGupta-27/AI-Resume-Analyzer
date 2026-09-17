# app/routers/analysis.py
from fastapi import APIRouter, Depends , Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.core.rate_limit import limiter 
from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.services.analysis_service import (
    run_analysis,
    list_analyses_for_resume,
    list_analyses_for_user,
    get_analysis_or_404,
)

router = APIRouter(prefix="/analyses", tags=["Analysis"])


@router.post("/", response_model=AnalysisResponse)
@limiter.limit("5/minute")
def create_analysis_endpoint(
    request: Request,
    body: AnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return run_analysis(db, current_user.id, body.resume_id, body.job_description_id)


@router.get("/", response_model=list[AnalysisResponse])
def list_user_analyses_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_analyses_for_user(db=db, user_id=current_user.id)


@router.get("/resume/{resume_id}", response_model=list[AnalysisResponse])
def list_analyses_endpoint(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_analyses_for_resume(db=db, user_id=current_user.id, resume_id=resume_id)


@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis_endpoint(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_analysis_or_404(db=db, analysis_id=analysis_id, user_id=current_user.id)