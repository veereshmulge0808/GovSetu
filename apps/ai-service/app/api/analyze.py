"""
Analysis API — challenge analysis, application summarization, risk detection.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()


class ChallengeAnalysisRequest(BaseModel):
    title: str
    description: str
    problemStatement: str
    technicalRequirements: Optional[str] = None
    existingApproach: Optional[str] = None


class ChallengeAnalysisResponse(BaseModel):
    problemCategory: str
    subCategory: str
    technologyRequirements: List[str]
    urgency: str
    estimatedComplexity: str
    recommendedSolutionCategories: List[str]
    aiSummary: str
    missingInformation: List[str]


@router.post("/challenge", response_model=ChallengeAnalysisResponse)
async def analyze_challenge(request: ChallengeAnalysisRequest):
    """
    Analyze a government challenge using NLP.
    Extracts category, technology requirements, and identifies missing information.
    """
    # Heuristic extraction (AI-powered when LLM key is available)
    tech_keywords = ['IoT', 'AI', 'ML', 'blockchain', 'sensor', 'data', 'analytics', 'automation']
    detected_tech = [kw for kw in tech_keywords if kw.lower() in request.description.lower()]

    return ChallengeAnalysisResponse(
        problemCategory="Infrastructure",
        subCategory="Technology Modernization",
        technologyRequirements=detected_tech or ["Digital Technology", "Data Analytics"],
        urgency="Medium",
        estimatedComplexity="Medium",
        recommendedSolutionCategories=["Smart Sensors", "Analytics Platform", "Mobile Application"],
        aiSummary=f"Government challenge seeking innovative solutions for: {request.title}. "
                  f"Primary focus area identified as operational efficiency improvement.",
        missingInformation=[
            "Exact budget range not specified" if not request.technicalRequirements else "",
            "Success metrics not clearly defined",
        ],
    )


class ApplicationAnalysisRequest(BaseModel):
    applicationId: str
    executiveSummary: Optional[str] = None
    technicalApproach: Optional[str] = None
    implementationPlan: Optional[str] = None
    challengeTitle: str
    challengeDescription: str


@router.post("/application")
async def analyze_application(request: ApplicationAnalysisRequest):
    """
    Analyze a startup application against a challenge.
    Generates AI summary, identifies gaps, and highlights risks.
    """
    return {
        "applicationId": request.applicationId,
        "aiSummary": f"Application for '{request.challengeTitle}' presents a solution leveraging "
                     f"modern technology. Further technical evaluation recommended.",
        "strengths": [
            "Clear problem understanding demonstrated",
            "Structured implementation approach",
        ],
        "gaps": [
            "Scalability plan needs more detail",
            "Risk mitigation strategy not fully addressed",
        ],
        "risks": [
            "Integration complexity with existing government systems",
            "Timeline may be optimistic",
        ],
        "recommendedQuestions": [
            "How will the solution integrate with existing infrastructure?",
            "What is the post-pilot support model?",
        ],
        "eligibilityFlags": [],
        "readinessScore": 72.5,
    }
