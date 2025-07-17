import { AlertCircle, FileText, Upload } from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface PDFUploadProps {
  onFileUpload: (files: File[]) => void;
}

const PDFUpload: React.FC<PDFUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const maxSize = 10 * 1024 * 1024;

    Array.from(files).forEach(file => {
      if (file.type !== 'application/pdf') {
        setUploadError('Only PDF files are allowed');
        return;
      }
      if (file.size > maxSize) {
        setUploadError('File size must be less than 10MB');
        return;
      }
      validFiles.push(file);
    });

    return validFiles;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setUploadError(null);
    setIsUploading(true);

    const files = validateFiles(e.dataTransfer.files);
    if (files.length > 0) {
      setTimeout(() => {
        onFileUpload(files);
        setIsUploading(false);
      }, 500);
    } else {
      setIsUploading(false);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setIsUploading(true);

    if (e.target.files) {
      const files = validateFiles(e.target.files);
      if (files.length > 0) {
        setTimeout(() => {
          onFileUpload(files);
          setIsUploading(false);
        }, 500);
      } else {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${isDragOver
            ? 'border-blue-400 bg-blue-50 scale-105'
            : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
          }
          ${isUploading ? 'bg-blue-50 border-blue-400' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center space-y-4">
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="text-blue-600 font-medium">Uploading...</p>
            </>
          ) : (
            <>
              <div className={`
                p-4 rounded-full transition-colors duration-200
                ${isDragOver ? 'bg-blue-500' : 'bg-gray-100'}
              `}>
                <Upload className={`w-8 h-8 ${isDragOver ? 'text-white' : 'text-gray-600'}`} />
              </div>

              <div>
                <p className="text-xl font-semibold text-gray-900 mb-2">
                  {isDragOver ? 'Drop your PDFs here' : 'Upload PDF Files'}
                </p>
                <p className="text-gray-600">
                  Drag & drop your PDF files here, or{' '}
                  <span className="text-blue-500 font-medium">click to browse</span>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Maximum file size: 10MB • Supports: PDF only
                </p>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <FileText className="w-4 h-4" />
                  <span>PDF Format</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Multiple Files</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Instant Preview</span>
              </div>
            </>
          )}
        </div>
      </div>

      {uploadError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{uploadError}</p>
        </div>
      )}
    </div>
  );
};

export default PDFUpload;