import { Calendar, Download, Eye, FileText, Trash2 } from 'lucide-react';
import React from 'react';
import { PDFFile } from '../types/pdf';
import PDFThumbnail from './PDFThumbnail';

interface PDFListProps {
  pdfs: PDFFile[];
  onView: (pdf: PDFFile) => void;
  onDelete: (id: number) => void;
  onDownload: (pdf: PDFFile) => void;
  formatFileSize: (bytes: number) => string;
}

const PDFList: React.FC<PDFListProps> = ({
  pdfs,
  onView,
  onDelete,
  onDownload,
  formatFileSize
}) => {
  if (pdfs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <FileText className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No PDFs uploaded yet</h3>
        <p className="text-gray-600">Upload your first PDF to get started</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Uploaded PDFs ({pdfs.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pdfs.map((pdf) => (
          <div
            key={pdf.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="aspect-[3/4] h-[200px] w-full bg-gray-50 flex items-center justify-center border-b border-gray-200">
              <PDFThumbnail fileUrl={pdf.url} fileName={pdf.name} />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 truncate mb-2" title={pdf.name}>
                {pdf.name}
              </h3>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(pdf.uploadDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>{formatFileSize(pdf.size)}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onView(pdf)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => onDownload(pdf)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-200"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDelete(pdf.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors duration-200"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDFList;