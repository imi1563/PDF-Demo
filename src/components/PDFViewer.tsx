import { ChevronLeft, ChevronRight, Download, X, ZoomIn, ZoomOut } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { PDFFile } from '../types/pdf';

interface PDFViewerProps {
  pdf: PDFFile;
  isOpen: boolean;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdf, isOpen, onClose }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageRendering, setPageRendering] = useState(false);
  const [pageNumPending, setPageNumPending] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen || !pdf) return;

    let isMounted = true;

    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!window.pdfjsLib) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

        const pdfDocument = await window.pdfjsLib.getDocument(pdf.url).promise;

        if (!isMounted) return;

        setPdfDoc(pdfDocument);
        setNumPages(pdfDocument.numPages);
        setLoading(false);

        renderPage(1);
      } catch (err) {
        console.error('PDF loading error:', err);
        if (isMounted) {
          setLoading(false);
          setError('Failed to load PDF document');
        }
      }
    };

    loadPDF();

    return () => {
      isMounted = false;
    };
  }, [isOpen, pdf]);

  const renderPage = async (num: number) => {
    if (!pdfDoc || !canvasRef.current) return;

    setPageRendering(true);

    try {
      const page = await pdfDoc.getPage(num);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas context is null');

      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      setPageRendering(false);

      if (pageNumPending !== null) {
        renderPage(pageNumPending);
        setPageNumPending(null);
      }
    } catch (err) {
      console.error('Page rendering error:', err);
      setPageRendering(false);
      setError('Failed to render PDF page');
    }
  };

  const queueRenderPage = (num: number) => {
    if (pageRendering) {
      setPageNumPending(num);
    } else {
      renderPage(num);
    }
  };

  useEffect(() => {
    if (pdfDoc && currentPage) {
      queueRenderPage(currentPage);
    }
  }, [currentPage, scale, pdfDoc]);

  const goToPrevPage = () => {
    if (currentPage <= 1) return;
    setCurrentPage(prev => prev - 1);
  };

  const goToNextPage = () => {
    if (currentPage >= numPages) return;
    setCurrentPage(prev => prev + 1);
  };

  const zoomIn = () => {
    setScale(prev => Math.min(3, prev + 0.2));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.2));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdf.url;
    link.download = pdf.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate" title={pdf.name}>
              {pdf.name}
            </h3>
            {!loading && !error && (
              <p className="text-sm text-gray-600">
                Page {currentPage} of {numPages}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={zoomOut}
              disabled={loading || error !== null}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>

            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={zoomIn}
              disabled={loading || error !== null}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-gray-300"></div>

            <button
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center text-red-600">
                <X className="w-12 h-12 mx-auto mb-2" />
                <p className="font-medium">{error}</p>
                <p className="text-sm text-gray-500 mt-1">Please try again or use a different PDF</p>
              </div>
            </div>
          )}

          {!error && !loading && (
            <div className="flex items-center justify-center p-4 min-h-full">
              <canvas
                ref={canvasRef}
                className="shadow-lg border border-gray-300 bg-white max-w-full max-h-full"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto'
                }}
              />
            </div>
          )}
        </div>

        {!loading && !error && numPages > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= numPages) {
                    setCurrentPage(page);
                  }
                }}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={1}
                max={numPages}
              />
              <span className="text-gray-600">of {numPages}</span>
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === numPages}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export default PDFViewer;