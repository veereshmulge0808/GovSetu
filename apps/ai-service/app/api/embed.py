"""
Embedding API — generate text embeddings.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.services.matching_service import EmbeddingProvider

router = APIRouter()
provider = EmbeddingProvider()


class EmbedRequest(BaseModel):
    text: str


class EmbedResponse(BaseModel):
    embedding: List[float]
    dimensions: int
    model: str


@router.post("/", response_model=EmbedResponse)
async def generate_embedding(request: EmbedRequest):
    """Generate an embedding vector for a given text string."""
    from app.config import get_settings
    settings = get_settings()
    embedding = await provider.generate(request.text)
    return EmbedResponse(
        embedding=embedding,
        dimensions=len(embedding),
        model=settings.embedding_model,
    )
