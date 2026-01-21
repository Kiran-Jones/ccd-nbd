import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { convertToHtml } from 'mammoth';
import { FileText, AlertCircle, Loader2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  file: File | null;
}

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const DEFAULT_ZOOM_INDEX = 2; // 100%

export default function ResumeViewer({ file }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [docxHtml, setDocxHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const zoom = ZOOM_LEVELS[zoomIndex];

  const isPdf = file?.type === 'application/pdf';
  const isDocx =
    file?.type ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  // Measure container width for responsive PDF sizing
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Use most of the container width, leaving some padding
        setContainerWidth(containerRef.current.clientWidth - 48);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Convert DOCX to HTML when file changes
  useEffect(() => {
    if (!file || !isDocx) {
      setDocxHtml(null);
      return;
    }

    const convertDocx = async () => {
      setLoading(true);
      setError(null);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await convertToHtml({ arrayBuffer });
        setDocxHtml(result.value);
      } catch (err) {
        setError('Failed to render document');
        console.error('DOCX conversion error:', err);
      } finally {
        setLoading(false);
      }
    };

    convertDocx();
  }, [file, isDocx]);

  // Reset zoom when file changes
  useEffect(() => {
    setZoomIndex(DEFAULT_ZOOM_INDEX);
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = () => {
    setError('Failed to load PDF');
  };

  const handleZoomIn = () => {
    setZoomIndex((prev) => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
  };

  const handleZoomOut = () => {
    setZoomIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleResetZoom = () => {
    setZoomIndex(DEFAULT_ZOOM_INDEX);
  };

  // Calculate PDF width based on container and zoom
  const baseWidth = Math.min(containerWidth, 550);
  const pdfWidth = baseWidth * zoom;

  // No file provided
  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#737373] py-12">
        <FileText size={48} className="mb-4 opacity-50" />
        <p className="text-sm">No document to preview</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#9D162E] py-12">
        <AlertCircle size={48} className="mb-4" />
        <p className="text-sm font-medium">{error}</p>
        <p className="text-xs text-[#737373] mt-1">
          You can still review the extracted text on the right
        </p>
      </div>
    );
  }

  // Loading state for DOCX
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[#737373] py-12">
        <Loader2 size={48} className="mb-4 animate-spin" />
        <p className="text-sm">Loading document...</p>
      </div>
    );
  }

  // Zoom controls component
  const ZoomControls = () => (
    <div className="sticky top-0 z-10 bg-[#F5F5F5] border-b border-[#E5E5E5] px-4 py-2 flex items-center justify-center gap-2">
      <button
        onClick={handleZoomOut}
        disabled={zoomIndex === 0}
        className="p-1.5 rounded hover:bg-[#E5E5E5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Zoom out"
        aria-label="Zoom out"
      >
        <ZoomOut size={18} className="text-[#525252]" />
      </button>
      <span className="text-sm text-[#525252] min-w-[60px] text-center font-medium">
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={handleZoomIn}
        disabled={zoomIndex === ZOOM_LEVELS.length - 1}
        className="p-1.5 rounded hover:bg-[#E5E5E5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Zoom in"
        aria-label="Zoom in"
      >
        <ZoomIn size={18} className="text-[#525252]" />
      </button>
      <button
        onClick={handleResetZoom}
        disabled={zoomIndex === DEFAULT_ZOOM_INDEX}
        className="p-1.5 rounded hover:bg-[#E5E5E5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors ml-1"
        title="Reset zoom"
        aria-label="Reset zoom"
      >
        <RotateCcw size={16} className="text-[#525252]" />
      </button>
    </div>
  );

  // PDF viewer
  if (isPdf) {
    return (
      <div ref={containerRef} className="flex flex-col h-full bg-[#F5F5F5]">
        <ZoomControls />
        <div className="flex-1 overflow-auto p-6">
          <div className="flex flex-col items-center">
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-[#737373]" />
                </div>
              }
            >
              {numPages &&
                Array.from({ length: numPages }, (_, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <div className="shadow-lg bg-white">
                      <Page
                        pageNumber={index + 1}
                        width={pdfWidth}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                      />
                    </div>
                    <p className="text-center text-xs text-[#737373] mt-3">
                      Page {index + 1} of {numPages}
                    </p>
                  </div>
                ))}
            </Document>
          </div>
        </div>
      </div>
    );
  }

  // DOCX viewer
  if (isDocx && docxHtml) {
    return (
      <div ref={containerRef} className="flex flex-col h-full bg-[#F5F5F5]">
        <ZoomControls />
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-center">
            <div
              className="bg-white shadow-lg prose prose-sm"
              style={{
                width: `${baseWidth * zoom}px`,
                padding: `${24 * zoom}px`,
                fontSize: `${zoom}rem`,
              }}
              dangerouslySetInnerHTML={{ __html: docxHtml }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Unsupported file type
  return (
    <div className="flex flex-col items-center justify-center h-full text-[#737373] py-12">
      <FileText size={48} className="mb-4 opacity-50" />
      <p className="text-sm">Unsupported file format</p>
    </div>
  );
}
