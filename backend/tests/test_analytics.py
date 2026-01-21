import pytest
from app.services.analytics import AnalyticsService
from app.models.bin import Bin
from app.models.bullet_point import BulletPoint, FormattingInfo


@pytest.fixture
def analytics_service():
    return AnalyticsService()


def create_bullet(text: str, id: str = "test-id") -> BulletPoint:
    return BulletPoint(
        id=id,
        text=text,
        formatting=FormattingInfo(
            bold=[False] * len(text),
            italic=[False] * len(text)
        ),
        original_index=0
    )


def create_bins_with_bullets(counts: dict) -> list[Bin]:
    bins = []
    for bin_id, count in counts.items():
        bullets = [create_bullet(f"Bullet {i}", f"{bin_id}-{i}") for i in range(count)]
        bins.append(Bin(id=bin_id, label=bin_id.title(), color="#000", bullets=bullets))
    return bins


class TestAnalyticsService:
    def test_empty_bins(self, analytics_service):
        bins = create_bins_with_bullets({
            "interests": 0,
            "skillset": 0,
            "values": 0,
            "strengths": 0
        })

        result = analytics_service.calculate_analytics(bins)

        assert result.top_category == "None"
        assert len(result.suggestions) == 1
        assert "categorizing" in result.suggestions[0].lower()

    def test_distribution_calculation(self, analytics_service):
        bins = create_bins_with_bullets({
            "interests": 5,
            "skillset": 3,
            "values": 1,
            "strengths": 1
        })

        result = analytics_service.calculate_analytics(bins)

        assert len(result.distribution) == 4

        interests_dist = next(d for d in result.distribution if d.bin_id == "interests")
        assert interests_dist.count == 5
        assert interests_dist.percentage == 50.0

    def test_top_category(self, analytics_service):
        bins = create_bins_with_bullets({
            "interests": 2,
            "skillset": 5,
            "values": 1,
            "strengths": 2
        })

        result = analytics_service.calculate_analytics(bins)

        assert result.top_category == "Skillset"

    def test_suggestion_for_underrepresented(self, analytics_service):
        bins = create_bins_with_bullets({
            "interests": 10,
            "skillset": 1,
            "values": 0,
            "strengths": 0
        })

        result = analytics_service.calculate_analytics(bins)

        # Should have suggestion for skillset (9.1% < 15%)
        skillset_suggestions = [s for s in result.suggestions if "Skillset" in s]
        assert len(skillset_suggestions) > 0

    def test_suggestion_for_dominant(self, analytics_service):
        bins = create_bins_with_bullets({
            "interests": 8,
            "skillset": 1,
            "values": 1,
            "strengths": 0
        })

        result = analytics_service.calculate_analytics(bins)

        # Should have suggestion for interests (80% > 40%)
        interests_suggestions = [s for s in result.suggestions if "Interests" in s and "Strong" in s]
        assert len(interests_suggestions) > 0

    def test_suggestion_for_empty_category(self, analytics_service):
        bins = create_bins_with_bullets({
            "interests": 5,
            "skillset": 5,
            "values": 0,
            "strengths": 0
        })

        result = analytics_service.calculate_analytics(bins)

        # Should have suggestions for empty categories
        empty_suggestions = [s for s in result.suggestions if "No bullets" in s]
        assert len(empty_suggestions) >= 2

    def test_balanced_profile_suggestion(self, analytics_service):
        bins = create_bins_with_bullets({
            "interests": 3,
            "skillset": 3,
            "values": 2,
            "strengths": 2
        })

        result = analytics_service.calculate_analytics(bins)

        balanced_suggestions = [s for s in result.suggestions if "balanced" in s.lower()]
        assert len(balanced_suggestions) > 0

    def test_max_suggestions(self, analytics_service):
        bins = create_bins_with_bullets({
            "interests": 1,
            "skillset": 1,
            "values": 1,
            "strengths": 1
        })

        result = analytics_service.calculate_analytics(bins)

        # Should not exceed 5 suggestions
        assert len(result.suggestions) <= 5
