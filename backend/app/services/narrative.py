import json
import logging
from typing import List, Optional

from openai import OpenAI
from pydantic import BaseModel

from app.config.settings import settings
from app.models.analysis import AnalysisResult

logger = logging.getLogger(__name__)


class ExperienceSuggestion(BaseModel):
    original: str
    category: str
    alignment: str  # "strong", "moderate", "weak"
    reframe: Optional[str] = None
    explanation: str


class NarrativeResponse(BaseModel):
    paragraph: str
    bullets: List[str]
    experienceSuggestions: List[ExperienceSuggestion] = []


class NarrativeService:
    """Service for generating AI-powered narrative analysis using Dartmouth Chat AI."""

    def __init__(self):
        self._client = None

    @property
    def client(self):
        """Lazy initialization of Dartmouth Chat AI client."""
        if self._client is None:
            if not settings.dartmouth_ai_api_key:
                raise ValueError("Dartmouth AI API key is not configured")
            self._client = OpenAI(
                api_key=settings.dartmouth_ai_api_key,
                base_url=settings.dartmouth_ai_base_url,
            )
        return self._client

    def generate_narrative(self, analysis: AnalysisResult) -> NarrativeResponse:
        """Generate narrative guidance based on student's workshop journey."""

        if not analysis.onboardingData:
            return NarrativeResponse(
                paragraph="Complete the onboarding steps to receive personalized narrative guidance.",
                bullets=[
                    "Identify your defining word",
                    "Select your career value",
                    "Categorize your experiences",
                ],
                experienceSuggestions=[],
            )

        # Build context from analysis data
        onboarding = analysis.onboardingData
        distribution_summary = self._format_distribution(analysis)
        experiences_detailed = self._format_experiences_detailed(analysis)

        system_prompt = """You are a career storytelling strategist helping students at Dartmouth College's Center for Career Design craft their professional narrative.

Your role is to analyze SPECIFIC EXPERIENCES from the student's resume and provide personalized reframing suggestions based on their self-identified word and career value.

You must:
1. Analyze each experience through the lens of the student's defining WORD
2. Identify which experiences strongly align, moderately align, or weakly align with their word
3. For experiences that don't strongly align, suggest how to REFRAME the narrative (not rewrite the resume bullet, but how to TALK about it)
4. Connect patterns to their career value

CRITICAL CONSTRAINTS:
- Do NOT suggest resume rewrites or edits to the bullet text itself
- Focus on how to VERBALLY frame and discuss experiences in interviews/networking
- Provide specific, actionable reframing language
- Reference actual experiences by name/content

Respond with valid JSON in this exact format:
{
  "paragraph": "2-3 sentences analyzing how their word connects to their experience patterns and what story emerges",
  "bullets": ["3-4 high-level storytelling strategies specific to their profile"],
  "experienceSuggestions": [
    {
      "original": "The exact text of the experience bullet",
      "category": "The category it was placed in",
      "alignment": "strong|moderate|weak",
      "reframe": "If alignment is moderate or weak, provide a suggested way to verbally frame this experience. If strong, set to null",
      "explanation": "Brief explanation of why this alignment rating and how the reframe connects to their word"
    }
  ]
}

For experienceSuggestions:
- Include 3-6 experiences that would most benefit from analysis
- Prioritize experiences with weak or moderate alignment that have reframing potential
- Include at least 1 strong alignment as a positive example
- The "reframe" should be a verbal framing suggestion, like "When discussing this, emphasize how you served as a [WORD] by..."
- Keep explanations concise (1-2 sentences)"""

        user_prompt = f"""Student's Workshop Journey:

DEFINING WORD: {onboarding.word}
CAREER VALUE: {onboarding.careerValue}

SELF-DESCRIPTION: {onboarding.paragraph}

DISTILLED IDENTITY: {onboarding.sentence}

EXPERIENCE DISTRIBUTION:
{distribution_summary}

TOP CATEGORY: {analysis.analytics.top_category}

DETAILED EXPERIENCES BY CATEGORY:
{experiences_detailed}

Analyze these specific experiences through the lens of "{onboarding.word}" and provide reframing suggestions for experiences that don't naturally align with this word. Help the student see how to tell their story consistently around "{onboarding.word}" even when the original experience framing doesn't emphasize it."""

        logger.info(
            f"Generating narrative for word: {onboarding.word}, value: {onboarding.careerValue}"
        )
        logger.debug(f"Experiences to analyze:\n{experiences_detailed}")

        response = self.client.chat.completions.create(
            model=settings.dartmouth_ai_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            max_tokens=1500,
        )

        content = response.choices[0].message.content
        logger.debug(f"AI response: {content}")

        result = json.loads(content)

        experience_suggestions = []
        for exp in result.get("experienceSuggestions", []):
            experience_suggestions.append(
                ExperienceSuggestion(
                    original=exp.get("original", ""),
                    category=exp.get("category", ""),
                    alignment=exp.get("alignment", "moderate"),
                    reframe=exp.get("reframe"),
                    explanation=exp.get("explanation", ""),
                )
            )

        return NarrativeResponse(
            paragraph=result.get("paragraph", ""),
            bullets=result.get("bullets", []),
            experienceSuggestions=experience_suggestions,
        )

    def _format_distribution(self, analysis: AnalysisResult) -> str:
        """Format distribution data for the prompt."""
        lines = []
        for dist in analysis.analytics.distribution:
            bin_label = next(
                (b.label for b in analysis.bins if b.id == dist.bin_id), dist.bin_id
            )
            lines.append(f"- {bin_label}: {dist.count} items ({dist.percentage}%)")
        return "\n".join(lines)

    def _format_experiences_detailed(self, analysis: AnalysisResult) -> str:
        """Format experiences with full text for detailed analysis."""
        lines = []
        for bin in analysis.bins:
            if bin.bullets:
                lines.append(f"\n=== {bin.label.upper()} ===")
                for i, bullet in enumerate(bin.bullets, 1):
                    text = bullet.text[:300]
                    if len(bullet.text) > 300:
                        text += "..."
                    lines.append(f"{i}. {text}")
        return "\n".join(lines) if lines else "No experiences categorized yet."


narrative_service = NarrativeService()
