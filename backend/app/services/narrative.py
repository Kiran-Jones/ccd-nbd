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
    interviewParagraph: str = ""
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
                    "Select your career values",
                    "Categorize your experiences",
                ],
                experienceSuggestions=[],
            )

        # Build context from analysis data
        onboarding = analysis.onboardingData
        career_value = (
            onboarding.careerValue
            or (onboarding.careerValues[0] if onboarding.careerValues else "")
        )
        if not career_value:
            return NarrativeResponse(
                paragraph="Select at least one career value to receive personalized narrative guidance.",
                bullets=[
                    "Choose exactly two career values",
                    "Identify your defining word",
                    "Categorize your experiences",
                ],
                experienceSuggestions=[],
            )
        word = onboarding.finalWord or onboarding.word
        distribution_summary = self._format_distribution(analysis)
        experiences_detailed = self._format_experiences_detailed(analysis)

        system_prompt = """You are a career storytelling strategist helping students at Dartmouth College's Center for Career Design craft their professional narrative.

Your role is to analyze SPECIFIC EXPERIENCES from the student's resume and provide personalized reframing suggestions based on their self-identified word and career value, with the CAREER VALUE as the primary lens, the WORD as a supporting lens, and their top SKILLS and STRENGTHS as additional context.

You must:
1. Analyze each experience primarily through the lens of the student's CAREER VALUE, and secondarily through their defining WORD
2. Identify which experiences strongly align, moderately align, or weakly align with their career value (use the word as nuance, not the main driver)
3. For experiences that don't strongly align, suggest how to REFRAME the narrative (not rewrite the resume bullet, but how to TALK about it)
4. Connect patterns to their career value and how the word reinforces that value
5. Make the paragraph and bullets clearly distinct across different career values, even when the word stays the same
6. Provide an interview-style paragraph response that sounds natural when spoken aloud
7. Write directly to the student using second person ("you"), avoiding phrases like "this student"

CRITICAL CONSTRAINTS:
- Do NOT suggest resume rewrites or edits to the bullet text itself
- Focus on how to VERBALLY frame and discuss experiences in interviews/networking
- Provide specific, actionable reframing language
- Reference actual experiences by name/content

Respond with valid JSON in this exact format:
{
  "paragraph": "2-3 sentences analyzing how their career value connects to their experience patterns, with the word as a supporting theme",
  "interviewParagraph": "A single-paragraph answer to 'Tell me about yourself / walk me through your resume' that is 50-1200 characters",
  "bullets": ["3-4 high-level storytelling strategies grounded in their career value and reinforced by their word"],
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
- The "reframe" should be a verbal framing suggestion, like "When discussing this, emphasize how this experience expresses your [VALUE] while showing you are a [WORD]..."
- Keep explanations concise (1-2 sentences)"""

        skills = onboarding.careerSkills or []
        strengths = onboarding.careerStrengths or []
        skills_text = ", ".join(skills) if skills else "None provided"
        strengths_text = ", ".join(strengths) if strengths else "None provided"

        user_prompt = f"""Student's Workshop Journey:

DEFINING WORD: {word}
CAREER VALUE: {career_value}
TOP SKILLS: {skills_text}
TOP STRENGTHS: {strengths_text}

SELF-DESCRIPTION: {onboarding.paragraph}

DISTILLED IDENTITY: {onboarding.sentence}

EXPERIENCE DISTRIBUTION:
{distribution_summary}

TOP CATEGORY: {analysis.analytics.top_category}

DETAILED EXPERIENCES BY CATEGORY:
{experiences_detailed}

Analyze these specific experiences through the lens of "{career_value}" first, and "{word}" second. Use the student's top skills and strengths as supporting context. Provide reframing suggestions for experiences that don't naturally align with "{career_value}", while still connecting back to "{word}" as a supporting theme. Ensure the summary meaningfully changes when the career value changes."""

        logger.info(
            f"Generating narrative for word: {word}, value: {career_value}"
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
        if isinstance(result.get("paragraph"), str):
            result["paragraph"] = result["paragraph"].replace("this student", "you")
        if isinstance(result.get("interviewParagraph"), str):
            result["interviewParagraph"] = result["interviewParagraph"].replace(
                "this student", "you"
            )

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
            interviewParagraph=result.get("interviewParagraph", ""),
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
