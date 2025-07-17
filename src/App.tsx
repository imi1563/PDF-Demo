import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import PDFList from './components/PDFList';
import PDFUpload from './components/PDFUpload';
import PDFViewer from './components/PDFViewer';
import { PDFFile } from './types/pdf';

function App() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<PDFFile | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  console.log(pdfFiles)
  useEffect(() => {
    const savedPdfs = localStorage.getItem('uploadedPdfs');
    if (savedPdfs) {
      try {
        const parsed = JSON.parse(savedPdfs);
        setPdfFiles(parsed);
      } catch (error) {
        console.error('Error loading saved PDFs:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('uploadedPdfs', JSON.stringify(pdfFiles));
  }, [pdfFiles]);

  const handleFileUpload = (files: File[]) => {
    const newPdfFiles: PDFFile[] = files.map(file => {
      const fileUrl = URL.createObjectURL(file);
      return {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        url: fileUrl,
        uploadDate: new Date().toISOString(),
        file: file
      };
    });

    setPdfFiles(prev => [...prev, ...newPdfFiles]);
  };

  const handleDeletePdf = (id: number) => {
    setPdfFiles(prev => {
      const fileToDelete = prev.find(file => file.id === id);
      if (fileToDelete) {
        URL.revokeObjectURL(fileToDelete.url);
      }
      return prev.filter(file => file.id !== id);
    });
  };

  const handleViewPdf = (pdf: PDFFile) => {
    setSelectedPdf(pdf);
    setIsViewerOpen(true);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (pdf: PDFFile) => {
    const link = document.createElement('a');
    link.href = pdf.url;
    link.download = pdf.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-500 p-3 rounded-full">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PDF Manager</h1>
          <p className="text-gray-600 text-lg">Upload, preview, and manage your PDF documents</p>
        </div>

        <div className="mb-8">
          <PDFUpload onFileUpload={handleFileUpload} />
        </div>

        {pdfFiles.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{pdfFiles.length}</div>
                <div className="text-gray-600">Total PDFs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatFileSize(pdfFiles.reduce((total, file) => total + file.size, 0))}
                </div>
                <div className="text-gray-600">Total Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Date().toLocaleDateString()}
                </div>
                <div className="text-gray-600">Last Updated</div>
              </div>
            </div>
          </div>
        )}

        <PDFList
          pdfs={pdfFiles}
          onView={handleViewPdf}
          onDelete={handleDeletePdf}
          onDownload={handleDownload}
          formatFileSize={formatFileSize}
        />

        {isViewerOpen && selectedPdf && (
          <PDFViewer
            pdf={selectedPdf}
            isOpen={isViewerOpen}
            onClose={() => {
              setIsViewerOpen(false);
              setSelectedPdf(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;