import json
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from io import BytesIO
from app.models.analysis import AnalysisResult


class ExportService:
    """Service for exporting analysis results."""

    def export_to_json(self, result: AnalysisResult) -> str:
        """Export analysis result to JSON string."""
        data = {
            "student_analysis": {
                "timestamp": result.timestamp.isoformat(),
                "bins": [bin.model_dump() for bin in result.bins],
                "analytics": result.analytics.model_dump(),
            }
        }
        return json.dumps(data, indent=2)

    def export_to_pdf(self, result: AnalysisResult) -> BytesIO:
        """Export analysis result to PDF document."""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []

        # Title
        title_style = ParagraphStyle(
            "CustomTitle",
            parent=styles["Heading1"],
            fontSize=24,
            textColor=colors.HexColor("#1F2937"),
            spaceAfter=30,
        )
        title = Paragraph(
            f"Career Design Analysis - {result.timestamp.strftime('%B %d, %Y')}",
            title_style,
        )
        story.append(title)
        story.append(Spacer(1, 0.2 * inch))

        # Analytics Summary
        heading_style = styles["Heading2"]
        story.append(Paragraph("Distribution Overview", heading_style))
        story.append(Spacer(1, 0.1 * inch))

        # Create distribution table
        table_data = [["Category", "Count", "Percentage"]]
        for dist in result.analytics.distribution:
            bin_label = next(b.label for b in result.bins if b.id == dist.bin_id)
            table_data.append([bin_label, str(dist.count), f"{dist.percentage}%"])

        table = Table(table_data)
        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                    ("FONTSIZE", (0, 0), (-1, 0), 12),
                    ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                    ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
                    ("GRID", (0, 0), (-1, -1), 1, colors.black),
                ]
            )
        )
        story.append(table)
        story.append(Spacer(1, 0.3 * inch))

        # Bullets by Category
        story.append(Paragraph("Categorized Bullets", heading_style))
        story.append(Spacer(1, 0.1 * inch))

        for bin in result.bins:
            if bin.bullets:
                # Bin header with color
                bin_header = Paragraph(
                    f"<font color='{bin.color}'><b>{bin.label}</b></font> ({len(bin.bullets)} bullets)",
                    styles["Heading3"],
                )
                story.append(bin_header)

                # Bullets
                for bullet in bin.bullets:
                    bullet_text = self._format_bullet_text(
                        bullet.text, bullet.formatting
                    )
                    bullet_para = Paragraph(f"• {bullet_text}", styles["Normal"])
                    story.append(bullet_para)

                story.append(Spacer(1, 0.2 * inch))

        # Insights
        story.append(Paragraph("Insights & Suggestions", heading_style))
        story.append(Spacer(1, 0.1 * inch))

        for suggestion in result.analytics.suggestions:
            suggestion_para = Paragraph(f"• {suggestion}", styles["Normal"])
            story.append(suggestion_para)

        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer

    def _format_bullet_text(self, text: str, formatting) -> str:
        """Apply formatting to text for PDF (simplified)."""
        # For now, return plain text
        return text
