import re
import uuid
from typing import List

import pdfplumber
from docx import Document

from app.models.bullet_point import BulletPoint, FormattingInfo


class ResumeParser:
    """Service for extracting bullet points from resume files."""

    BULLET_PATTERNS = [
        r"^\s*•\s+",
        r"^\s*●\s+",
        r"^\s*▪\s+",
        r"^\s*○\s+",
        r"^\s*-\s+",
        r"^\s*–\s+",
        r"^\s*\*\s+",
        r"^\s*\d+\.\s+",
        r"^\s*\s+",  # Wingdings bullet
    ]

    BULLET_ONLY_PATTERNS = [
        r"^\s*•\s*$",
        r"^\s*●\s*$",
        r"^\s*▪\s*$",
        r"^\s*○\s*$",
        r"^\s*\s*$",
    ]

    BULLET_PREFIX_RE = re.compile("|".join(BULLET_PATTERNS))
    BULLET_ONLY_RE = re.compile("|".join(BULLET_ONLY_PATTERNS))

    # =========================
    # PDF PARSING (pdfplumber)
    # =========================

    def parse_pdf(self, file_path: str) -> List[BulletPoint]:
        all_text = ""

        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    all_text += text + "\n"

        return self._extract_bullets_from_text(all_text)

    # =========================
    # DOCX PARSING
    # =========================

    def parse_docx(self, file_path: str) -> List[BulletPoint]:
        doc = Document(file_path)
        bullets: List[BulletPoint] = []

        for idx, paragraph in enumerate(doc.paragraphs):
            if self._is_docx_bullet_paragraph(paragraph):
                clean_text, removed_prefix = self._clean_bullet_text_with_prefix_len(
                    paragraph.text
                )

                formatting = self._extract_formatting_from_paragraph(
                    paragraph, removed_prefix, len(clean_text)
                )

                bullets.append(
                    BulletPoint(
                        id=str(uuid.uuid4()),
                        text=clean_text,
                        formatting=formatting,
                        original_index=idx,
                    )
                )

        return bullets

    # =========================
    # CORE BULLET EXTRACTION
    # =========================

    def _looks_like_header(self, line: str) -> bool:
        s = (line or "").strip()
        if not s:
            return False

        letters = [c for c in s if c.isalpha()]
        if letters:
            uppercase_ratio = sum(c.isupper() for c in letters) / len(letters)
            if uppercase_ratio > 0.8 and len(s) <= 50:
                return True

        if s.endswith(":") and len(s) <= 60:
            return True

        return False

    def _extract_bullets_from_text(self, text: str) -> List[BulletPoint]:
        lines = [(ln or "").rstrip() for ln in (text or "").splitlines()]
        bullets: List[BulletPoint] = []

        i = 0
        while i < len(lines):
            raw = lines[i]
            line = raw.strip()

            if not line:
                i += 1
                continue

            original_index = i
            parts: List[str] = []
            started = False

            # Case 1: bullet + text on same line
            if self.BULLET_PREFIX_RE.match(line):
                started = True
                first = self.BULLET_PREFIX_RE.sub("", line, count=1).strip()
                if first:
                    parts.append(first)
                i += 1

            # Case 2: bullet marker alone
            elif self.BULLET_ONLY_RE.match(line):
                started = True
                i += 1

            if not started:
                i += 1
                continue

            # Consume continuation lines
            while i < len(lines):
                nxt_raw = lines[i]
                nxt = nxt_raw.strip()

                if not nxt:
                    i += 1
                    break

                if self.BULLET_PREFIX_RE.match(nxt) or self.BULLET_ONLY_RE.match(nxt):
                    break

                if self._looks_like_header(nxt):
                    break

                parts.append(nxt)
                i += 1

            clean_text = " ".join(parts).strip()
            if not clean_text:
                continue

            formatting = FormattingInfo(
                bold=[False] * len(clean_text),
                italic=[False] * len(clean_text),
            )

            bullets.append(
                BulletPoint(
                    id=str(uuid.uuid4()),
                    text=clean_text,
                    formatting=formatting,
                    original_index=original_index,
                )
            )

        return bullets

    # =========================
    # DOCX HELPERS
    # =========================

    def _is_docx_bullet_paragraph(self, paragraph) -> bool:
        text = paragraph.text or ""

        if self.BULLET_PREFIX_RE.match(text):
            return True

        # True Word bullets
        p = paragraph._p
        if p.pPr is not None and p.pPr.numPr is not None:
            return True

        style_name = getattr(getattr(paragraph, "style", None), "name", "") or ""
        if "List" in style_name:
            return True

        return False

    def _clean_bullet_text_with_prefix_len(self, text: str):
        m = self.BULLET_PREFIX_RE.match(text or "")
        if not m:
            return text.strip(), 0
        return text[m.end():].strip(), m.end()

    def _extract_formatting_from_paragraph(
        self, paragraph, removed_prefix_len: int, clean_len: int
    ) -> FormattingInfo:
        bold = []
        italic = []

        for run in paragraph.runs:
            n = len(run.text or "")
            bold_val = bool(run.bold) if run.bold is not None else False
            italic_val = bool(run.italic) if run.italic is not None else False
            bold.extend([bold_val] * n)
            italic.extend([italic_val] * n)

        bold = bold[removed_prefix_len:]
        italic = italic[removed_prefix_len:]

        if len(bold) < clean_len:
            bold.extend([False] * (clean_len - len(bold)))
        if len(italic) < clean_len:
            italic.extend([False] * (clean_len - len(italic)))

        return FormattingInfo(
            bold=bold[:clean_len],
            italic=italic[:clean_len],
        )

