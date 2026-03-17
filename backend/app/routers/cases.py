from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_db
from ..schemas import CaseCreate
from pydantic import BaseModel
from ..services.analysis_service import create_case_and_analyze
from ..services.ml_service import predict_case_outcome
from ..services.llm_service import analyze_signature_with_gemini, chat_with_gemini

class SignatureAnalysisRequest(BaseModel):
    raw_text: str

class ChatRequest(BaseModel):
    message: str

router = APIRouter(prefix="/cases", tags=["cases"])


@router.post("/predict")
async def predict_case(
    payload: CaseCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    """
    Analyze a legal case document using the ML model to predict win probability and generate graphical data.
    """
    # Just generating a quick case text metadata prediction
    metadata = {
        "title": payload.title,
        "jurisdiction": payload.jurisdiction,
        "case_type": payload.case_type,
    }
    ml_analysis = predict_case_outcome(payload.raw_text, metadata)
    
    return {
        "prediction": ml_analysis
    }


@router.post("/analyze")
async def analyze_case(
    payload: CaseCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    """
    Analyze a legal case document and return win probability + insights.

    For now this endpoint is open (no auth) so the prototype is easy to test.
    """
    result = await create_case_and_analyze(
        db,
        title=payload.title,
        description=payload.description,
        raw_text=payload.raw_text,
        jurisdiction=payload.jurisdiction,
        case_type=payload.case_type,
    )
    return result

@router.post("/analyze-signature")
async def analyze_signature(
    payload: SignatureAnalysisRequest
) -> dict:
    """
    Analyze a document specifically to find risks for laymen about to sign.
    """
    analysis = await analyze_signature_with_gemini(payload.raw_text)
    return analysis

@router.post("/chat")
async def chat(
    payload: ChatRequest
) -> dict:
    """
    Handle real-time conversational queries acting as LawGenie.
    """
    brief = await chat_with_gemini(payload.message)
    return brief

