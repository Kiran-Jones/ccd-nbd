import pytest
from app.services.parser import ResumeParser


@pytest.fixture
def parser():
    return ResumeParser()


class TestResumeParser:
    def test_bullet_pattern_detection_bullet(self, parser):
        assert parser.BULLET_PREFIX_RE.match("• Built ML pipeline")
        assert parser.BULLET_PREFIX_RE.match("  • Led team of engineers")

    def test_bullet_pattern_detection_dash(self, parser):
        assert parser.BULLET_PREFIX_RE.match("- Developed API endpoints")
        assert parser.BULLET_PREFIX_RE.match("  - Managed project timeline")

    def test_bullet_pattern_detection_asterisk(self, parser):
        assert parser.BULLET_PREFIX_RE.match("* Created database schema")

    def test_bullet_pattern_detection_numbered(self, parser):
        assert parser.BULLET_PREFIX_RE.match("1. First achievement")
        assert parser.BULLET_PREFIX_RE.match("10. Tenth item")

    def test_non_bullet_text(self, parser):
        assert not parser.BULLET_PREFIX_RE.match("Education")
        assert not parser.BULLET_PREFIX_RE.match("Work Experience")

    def test_extract_bullets_from_text(self, parser):
        text = """
        Work Experience
        • Built ML pipeline using TensorFlow
        • Developed REST API with FastAPI
        Education
        - Bachelor's in Computer Science
        """
        bullets = parser._extract_bullets_from_text(text)

        assert len(bullets) == 3
        assert bullets[0].text == "Built ML pipeline using TensorFlow"
        assert bullets[1].text == "Developed REST API with FastAPI"
        assert bullets[2].text == "Bachelor's in Computer Science"

    def test_bullet_has_id(self, parser):
        text = "• Test bullet"
        bullets = parser._extract_bullets_from_text(text)

        assert len(bullets) == 1
        assert bullets[0].id is not None
        assert len(bullets[0].id) > 0

    def test_bullet_has_formatting(self, parser):
        text = "• Test bullet"
        bullets = parser._extract_bullets_from_text(text)

        assert len(bullets) == 1
        assert bullets[0].formatting is not None
        assert len(bullets[0].formatting.bold) == len(bullets[0].text)
        assert len(bullets[0].formatting.italic) == len(bullets[0].text)

    def test_multiline_bullet(self, parser):
        text = """• This is a bullet point that
        continues on the next line
        and maybe even more

        • This is a separate bullet"""
        bullets = parser._extract_bullets_from_text(text)

        assert len(bullets) == 2
        assert "continues on the next line" in bullets[0].text

    def test_header_detection(self, parser):
        assert parser._looks_like_header("EDUCATION")
        assert parser._looks_like_header("WORK EXPERIENCE")
        assert parser._looks_like_header("Skills:")
        assert not parser._looks_like_header("Built a machine learning pipeline")
