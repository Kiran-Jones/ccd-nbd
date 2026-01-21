from typing import List
from app.models.bin import Bin
from app.models.analysis import Analytics, Distribution


class AnalyticsService:
    """Service for calculating resume analysis insights."""

    def calculate_analytics(self, bins: List[Bin]) -> Analytics:
        """Generate analytics from categorized bullets."""
        total_bullets = sum(len(bin.bullets) for bin in bins)

        if total_bullets == 0:
            return Analytics(
                distribution=[],
                top_category="None",
                suggestions=["Start categorizing your bullets to see insights!"],
            )

        # Calculate distribution
        distribution = []
        for bin in bins:
            count = len(bin.bullets)
            percentage = round((count / total_bullets) * 100, 1)
            distribution.append(
                Distribution(bin_id=bin.id, count=count, percentage=percentage)
            )

        # Find top category
        top_bin = max(bins, key=lambda b: len(b.bullets))
        top_category = top_bin.label

        # Generate suggestions
        suggestions = self._generate_suggestions(distribution, bins)

        return Analytics(
            distribution=distribution, top_category=top_category, suggestions=suggestions
        )

    def _generate_suggestions(
        self, distribution: List[Distribution], bins: List[Bin]
    ) -> List[str]:
        """Generate personalized suggestions based on distribution."""
        suggestions = []

        # Create a map of bin_id to label
        bin_map = {bin.id: bin.label for bin in bins}

        for dist in distribution:
            label = bin_map[dist.bin_id]

            if dist.percentage < 15 and dist.count > 0:
                suggestions.append(
                    f"Consider adding more bullets to '{label}' to provide a fuller picture"
                )
            elif dist.percentage > 40:
                suggestions.append(
                    f"Strong emphasis on '{label}' - this is a key part of your profile!"
                )
            elif dist.count == 0:
                suggestions.append(
                    f"No bullets in '{label}' - reflect on experiences that fit this category"
                )

        # Add general insights
        if len([d for d in distribution if d.count > 0]) == len(bins):
            suggestions.append("Well-balanced profile across all categories!")

        return suggestions[:5]  # Limit to top 5 suggestions
