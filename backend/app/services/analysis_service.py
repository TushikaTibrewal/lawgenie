from __future__ import annotations

from typing import Any, Dict

from sqlalchemy.ext.asyncio import AsyncSession

from ..models import CaseAnalysis, CaseFile
from .llm_service import analyze_with_gemini


async def create_case_and_analyze(
    db: AsyncSession,
    *,
    title: str,
    description: str | None,
    raw_text: str,
    jurisdiction: str | None,
    case_type: str | None,
) -> Dict[str, Any]:
    case = CaseFile(
        lawyer_id=None,  # will be linked to a lawyer profile in a later iteration
        title=title,
        description=description,
        raw_text=raw_text,
        jurisdiction=jurisdiction,
        case_type=case_type,
    )
    db.add(case)
    await db.flush()

    metadata: Dict[str, Any] = {
        "title": title,
        "jurisdiction": jurisdiction,
        "case_type": case_type,
    }
    analysis_payload = await analyze_with_gemini(raw_text, metadata)

    analysis = CaseAnalysis(
        case_id=case.id,
        model_name="openai-" + str(analysis_payload.get("model", "gpt-4.1-mini")),
        win_probability=0.0, # Deprecated for this feature but kept in DB schema for case analyzer
        risk_factors=analysis_payload.get("risk_clauses", []),
        summary=analysis_payload.get("summary", ""),
    )
    db.add(analysis)
    await db.commit()
    await db.refresh(case)
    await db.refresh(analysis)

    return {
        "case": {
            "id": case.id,
            "title": case.title,
            "description": case.description,
            "jurisdiction": case.jurisdiction,
            "case_type": case.case_type,
            "created_at": case.created_at.isoformat(),
        },
        "analysis": {
            "id": analysis.id,
            "summary": analysis_payload.get("summary"),
            "risk_clauses": analysis_payload.get("risk_clauses", []),
            "key_points": analysis_payload.get("key_points", []),
            "strong_areas": analysis_payload.get("strong_areas", []),
        },
    }

