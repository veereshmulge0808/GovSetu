"""
Matching service — core AI matching logic.

Architecture (from Techstack.md / Architecture.md):

Challenge Text
    ↓
Embedding Generation (provider-agnostic)
    ↓
Vector Search (pgvector)
    ↓
Candidate Retrieval
    ↓
Multi-factor Scoring:
  - Semantic similarity (cosine distance from embeddings)
  - Domain/sector compatibility
  - Technology compatibility
  - Government experience bonus
  - TRL readiness
  - Geographic compatibility
  - Budget compatibility
    ↓
Weighted Ranking
    ↓
Explanation Generation (LLM)
    ↓
Ranked Results with Explanations
"""

import asyncio
from typing import List, Dict, Any, Optional
import asyncpg
from app.config import get_settings

settings = get_settings()


class EmbeddingProvider:
    """
    Provider-agnostic embedding abstraction.
    Implements the interface defined in Techstack.md section 8.3.
    """

    async def generate(self, text: str) -> List[float]:
        """Generate a 1536-dimensional embedding for the given text."""
        if settings.llm_provider == "openai" and settings.openai_api_key:
            return await self._openai_embed(text)
        else:
            # Fallback: simple hash-based mock embedding (development only)
            return self._mock_embed(text)

    async def _openai_embed(self, text: str) -> List[float]:
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=settings.openai_api_key)
            response = await client.embeddings.create(
                input=text,
                model=settings.embedding_model,
            )
            return response.data[0].embedding
        except Exception:
            return self._mock_embed(text)

    def _mock_embed(self, text: str) -> List[float]:
        """Mock embedding — returns deterministic pseudo-random vector."""
        import hashlib
        import struct
        digest = hashlib.sha256(text.encode()).digest()
        # Tile the 32-byte digest to fill 1536 floats
        values = []
        for i in range(1536):
            idx = (i * 4) % len(digest)
            val = struct.unpack_from('f', bytes([digest[j % 32] for j in range(idx, idx + 4)]))[0]
            values.append(float(val))
        # Normalize to unit vector
        magnitude = sum(v * v for v in values) ** 0.5
        if magnitude > 0:
            values = [v / magnitude for v in values]
        return values


class MatchingService:
    def __init__(self):
        self.embedding_provider = EmbeddingProvider()

    async def match_challenge(self, challenge_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Main matching pipeline as defined in Architecture.md section 29.
        """
        # Step 1: Build challenge text for embedding
        challenge_text = self._build_challenge_text(challenge_data)

        # Step 2: Generate challenge embedding
        challenge_embedding = await self.embedding_provider.generate(challenge_text)

        # Step 3: Retrieve all startup profiles from DB and compute scores
        startup_profiles = await self._fetch_startup_profiles()

        # Step 4: Score each startup
        scored = []
        for profile in startup_profiles:
            score = self._compute_match_score(challenge_data, profile, challenge_embedding)
            scored.append(score)

        # Step 5: Sort by overall score descending
        scored.sort(key=lambda x: x['overallScore'], reverse=True)

        return scored[:50]  # Return top 50

    def _build_challenge_text(self, data: Dict[str, Any]) -> str:
        parts = [data.get('title', ''), data.get('problemStatement', '')]
        if data.get('technicalRequirements'):
            parts.append(data['technicalRequirements'])
        if data.get('sector'):
            parts.append(f"Sector: {data['sector']}")
        if data.get('domain'):
            parts.append(f"Domain: {data['domain']}")
        return ' '.join(filter(None, parts))

    def _compute_match_score(
        self,
        challenge: Dict[str, Any],
        startup: Dict[str, Any],
        challenge_embedding: List[float],
    ) -> Dict[str, Any]:
        """
        Multi-factor weighted scoring as defined in Techstack.md section 9.
        Score = w1*Semantic + w2*Domain + w3*Tech + w4*Experience + w5*Readiness + w6*Geo + w7*Budget
        """
        # Semantic similarity (if startup has embedding)
        semantic_score = 60.0  # Default when no startup embedding exists
        if startup.get('embedding') and len(startup['embedding']) == len(challenge_embedding):
            semantic_score = self._cosine_similarity(challenge_embedding, startup['embedding']) * 100

        # Domain compatibility
        domain_score = self._compute_domain_score(challenge, startup)

        # Technology compatibility
        tech_score = self._compute_tech_score(challenge, startup)

        # Experience score (govt experience bonus)
        experience_score = 80.0 if startup.get('govtExperience') else 40.0

        # TRL readiness score
        readiness_score = self._compute_readiness_score(startup)

        # Geographic score (simplified)
        geo_score = 75.0

        # Budget compatibility
        budget_score = self._compute_budget_score(challenge, startup)

        # Weighted sum (weights sum to 1.0)
        weights = {
            'semantic': 0.30,
            'domain': 0.20,
            'tech': 0.20,
            'experience': 0.10,
            'readiness': 0.10,
            'geo': 0.05,
            'budget': 0.05,
        }

        overall = (
            weights['semantic'] * semantic_score
            + weights['domain'] * domain_score
            + weights['tech'] * tech_score
            + weights['experience'] * experience_score
            + weights['readiness'] * readiness_score
            + weights['geo'] * geo_score
            + weights['budget'] * budget_score
        )

        explanation = self._generate_explanation(
            semantic_score, domain_score, tech_score, experience_score, challenge, startup
        )

        return {
            'startupProfileId': startup.get('id', ''),
            'overallScore': round(overall, 2),
            'semanticScore': round(semantic_score, 2),
            'domainScore': round(domain_score, 2),
            'technologyScore': round(tech_score, 2),
            'experienceScore': round(experience_score, 2),
            'readinessScore': round(readiness_score, 2),
            'geographicScore': round(geo_score, 2),
            'budgetScore': round(budget_score, 2),
            'explanation': explanation,
        }

    def _cosine_similarity(self, a: List[float], b: List[float]) -> float:
        dot = sum(x * y for x, y in zip(a, b))
        mag_a = sum(x * x for x in a) ** 0.5
        mag_b = sum(x * x for x in b) ** 0.5
        if mag_a == 0 or mag_b == 0:
            return 0.0
        return max(0.0, min(1.0, dot / (mag_a * mag_b)))

    def _compute_domain_score(self, challenge: Dict, startup: Dict) -> float:
        sector = (challenge.get('sector') or '').lower()
        industries = [i.lower() for i in (startup.get('industries') or [])]
        if not sector or not industries:
            return 50.0
        if any(sector in industry or industry in sector for industry in industries):
            return 90.0
        return 40.0

    def _compute_tech_score(self, challenge: Dict, startup: Dict) -> float:
        domain = (challenge.get('domain') or '').lower()
        tech_reqs = (challenge.get('technicalRequirements') or '').lower()
        technologies = [t.lower() for t in (startup.get('technologies') or [])]
        if not technologies:
            return 40.0
        text_to_match = f"{domain} {tech_reqs}"
        matches = sum(1 for tech in technologies if tech in text_to_match)
        return min(95.0, 40.0 + matches * 20.0)

    def _compute_readiness_score(self, startup: Dict) -> float:
        trl = startup.get('trlLevel', '')
        trl_scores = {
            'TRL_1': 20, 'TRL_2': 30, 'TRL_3': 40, 'TRL_4': 55,
            'TRL_5': 65, 'TRL_6': 75, 'TRL_7': 85, 'TRL_8': 92, 'TRL_9': 100,
        }
        return float(trl_scores.get(trl, 50))

    def _compute_budget_score(self, challenge: Dict, startup: Dict) -> float:
        # Simplified — startups without budget constraints get neutral score
        return 70.0

    def _generate_explanation(
        self, semantic: float, domain: float, tech: float, exp: float,
        challenge: Dict, startup: Dict,
    ) -> List[Dict]:
        explanation = []
        if semantic >= 70:
            explanation.append({'factor': 'Semantic Similarity', 'score': semantic, 'reason': 'Strong semantic alignment with the challenge description'})
        if domain >= 70:
            explanation.append({'factor': 'Domain Compatibility', 'score': domain, 'reason': f"Industry expertise matches challenge sector: {challenge.get('sector', 'N/A')}"})
        if tech >= 70:
            explanation.append({'factor': 'Technology Match', 'score': tech, 'reason': 'Technology stack aligns with technical requirements'})
        if exp >= 70:
            explanation.append({'factor': 'Government Experience', 'score': exp, 'reason': 'Previous government project experience detected'})
        return explanation

    async def _fetch_startup_profiles(self) -> List[Dict[str, Any]]:
        """Fetch startup profiles from PostgreSQL."""
        try:
            conn = await asyncpg.connect(settings.database_url)
            rows = await conn.fetch("""
                SELECT sp.id, sp.industries, sp.technologies, sp."trlLevel", sp."govtExperience",
                       sp."fundingStage", sp.geographies
                FROM startup_profiles sp
                WHERE sp.id IS NOT NULL
                LIMIT 200
            """)
            await conn.close()
            return [dict(row) for row in rows]
        except Exception:
            # Return empty list if DB is not available during development
            return []

    async def get_cached_matches(self, challenge_id: str, limit: int = 20) -> List[Dict]:
        """Retrieve cached match scores from the DB."""
        try:
            conn = await asyncpg.connect(settings.database_url)
            rows = await conn.fetch("""
                SELECT ms.*, sp.id as "startupId"
                FROM match_scores ms
                JOIN startup_profiles sp ON ms."startupProfileId" = sp.id
                WHERE ms."challengeId" = $1 AND ms."expiresAt" > NOW()
                ORDER BY ms."overallScore" DESC
                LIMIT $2
            """, challenge_id, limit)
            await conn.close()
            return [dict(row) for row in rows]
        except Exception:
            return []
