from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse, Response
from app.models.analysis import AnalysisResult
from app.services.export import ExportService
from app.services.analytics import AnalyticsService
from datetime import datetime

router = APIRouter()
export_service = ExportService()
analytics_service = AnalyticsService()


@router.post("/json")
async def export_json(result: AnalysisResult):
    """Export analysis result as JSON file."""
    try:
        json_str = export_service.export_to_json(result)
        return Response(
            content=json_str,
            media_type="application/json",
            headers={
                "Content-Disposition": f"attachment; filename=career_analysis_{datetime.now().strftime('%Y%m%d')}.json"
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"JSON export failed: {str(e)}")


@router.post("/pdf")
async def export_pdf(result: AnalysisResult):
    """Export analysis result as PDF file."""
    try:
        pdf_buffer = export_service.export_to_pdf(result)
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=career_analysis_{datetime.now().strftime('%Y%m%d')}.pdf"
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF export failed: {str(e)}")
