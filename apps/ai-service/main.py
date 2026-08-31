"""
GovSetu AI Service — FastAPI Application Entry Point

This service handles all AI workloads:
- Text embedding generation (for semantic search / matching)
- Challenge-Startup semantic matching
- Application analysis and summarization
- Document intelligence
- Risk identification

Architecture: Called by the NestJS backend via HTTP.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.match import router as match_router
from app.api.embed import router as embed_router
from app.api.analyze import router as analyze_router
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title="GovSetu AI Service",
    description="AI Intelligence Layer for the Government Innovation Procurement Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)

# ─── Routers ────────────────────────────────────────────────────────────────
app.include_router(match_router, prefix="/api/v1/match", tags=["Matching"])
app.include_router(embed_router, prefix="/api/v1/embed", tags=["Embeddings"])
app.include_router(analyze_router, prefix="/api/v1/analyze", tags=["Analysis"])


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "GovSetu AI Service", "version": "1.0.0"}
