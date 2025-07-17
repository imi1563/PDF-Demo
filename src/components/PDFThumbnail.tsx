import { AlertCircle, FileText } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface PDFThumbnailProps {
  fileUrl: string;
  fileName: string;
}

const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ fileUrl, fileName }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let isMounted = true;

    const generateThumbnail = async () => {
      try {
        setError(false);

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

        const pdf = await window.pdfjsLib.getDocument(fileUrl).promise;
        const page = await pdf.getPage(1);

        const canvas = canvasRef.current;
        if (!canvas || !isMounted) return;

        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas context is null');

        const scale = 0.3;
        const viewport = page.getViewport({ scale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;

        if (isMounted) {
          setThumbnailUrl(canvas.toDataURL('image/png'));
        }
      } catch (err) {
        console.error('Thumbnail generation error:', err);
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    generateThumbnail();

    return () => {
      isMounted = false;
    };
  }, [fileUrl]);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
        <AlertCircle className="w-8 h-8 mb-2" />
        <span className="text-xs text-center">Preview unavailable</span>
        <span className="text-xs text-center text-gray-500 mt-1">{fileName}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2"></div>
        <span className="text-xs">Loading preview...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={`Preview of ${fileName}`}
          className="max-w-full max-h-full object-contain shadow-sm rounded"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <FileText className="w-12 h-4 mb-2" />
          <span className="text-xs text-center">{fileName}</span>
        </div>
      )}
    </div>
  );
};

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export default PDFThumbnail;