import json
import logging
import re
from typing import List

from openai import OpenAI

from app.config.settings import settings

logger = logging.getLogger(__name__)


def _extract_json(text: str) -> str:
    """Extract a JSON object from LLM output that may include code fences or trailing text."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*\n?", "", text)
    text = re.sub(r"\n?```\s*$", "", text.strip())
    start = text.find("{")
    if start == -1:
        return text
    depth = 0
    in_string = False
    escape = False
    for i in range(start, len(text)):
        c = text[i]
        if escape:
            escape = False
            continue
        if c == "\\":
            escape = True
            continue
        if c == '"':
            in_string = not in_string
            continue
        if in_string:
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
    return text[start:]


class WordSuggestionService:
    """Service for generating a distilled single-word narrative summary."""

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

    def generate_word(self, bullets: List[str]) -> str:
        """Generate a single-word narrative summary from resume bullets."""
        condensed = "\n".join(f"- {bullet}" for bullet in bullets[:60])
        if not condensed.strip():
            return "Focus"

        system_prompt = """You are a career design coach helping a student distill their narrative into a single word.

Constraints:
- Return EXACTLY one word (no spaces, no punctuation)
- Avoid generic words like "good", "strong", "nice"
- The word should feel authentic, aspirational, and grounded in the experiences
- Use title case (e.g., "Builder", "Connector")

Respond with valid JSON in this exact format:
{ "word": "SingleWord" }"""

        user_prompt = f"""Resume experience bullets:
{condensed}

Distill the overall narrative into a single word."""

        logger.info("Generating AI word suggestion from resume bullets.")

        response = self.client.chat.completions.create(
            model=settings.dartmouth_ai_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.6,
            max_tokens=60,
        )

        content = response.choices[0].message.content
        logger.debug(f"AI word response: {content}")

        content = _extract_json(content)

        result = json.loads(content)
        word = result.get("word", "").strip()
        if not word:
            return "Focus"
        return word


word_service = WordSuggestionService()
