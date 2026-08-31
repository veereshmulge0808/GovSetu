"""
Matching API router — challenge-to-startup AI matching.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.services.matching_service import MatchingService

router = APIRouter()
matching_service = MatchingService()


class ChallengeMatchRequest(BaseModel):
    challengeId: str
    title: str
    description: str
    problemStatement: str
    sector: Optional[str] = None
    domain: Optional[str] = None
    technicalRequirements: Optional[str] = None
    budgetMinLakh: Optional[float] = None
    budgetMaxLakh: Optional[float] = None


class MatchResult(BaseModel):
    startupProfileId: str
    overallScore: float
    semanticScore: float
    domainScore: float
    technologyScore: float
    experienceScore: float
    readinessScore: float
    geographicScore: float
    budgetScore: float
    explanation: List[dict]
    risks: Optional[List[str]] = None


@router.post("/challenge", response_model=dict)
async def match_challenge_to_startups(request: ChallengeMatchRequest):
    """
    Trigger AI-powered matching between a government challenge and all startup profiles.
    Returns ranked list of startup matches with explainable scores.
    """
    try:
        results = await matching_service.match_challenge(request.dict())
        return {"challengeId": request.challengeId, "matches": results, "count": len(results)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching failed: {str(e)}")


@router.get("/challenge/{challenge_id}")
async def get_cached_matches(challenge_id: str, limit: int = 20):
    """
    Get cached match scores for a challenge.
    """
    results = await matching_service.get_cached_matches(challenge_id, limit)
    return {"challengeId": challenge_id, "matches": results}
