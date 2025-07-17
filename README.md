# PDF Manager Demo

A modern React + TypeScript application for uploading, previewing, and managing PDF documents. Built with Vite, Tailwind CSS, and PDF.js.

## Features
- Upload multiple PDF files (max 10MB each)
- Instant preview and thumbnail generation
- View, download, and delete PDFs
- Responsive, clean UI with Tailwind CSS
- Local storage persistence (PDF list remains after refresh)

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/imi1563/PDF-Demo.git
cd PDF-Demo
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
- The app will be available at the URL shown in your terminal (usually [http://localhost:5173](http://localhost:5173)).

### 4. Build for production
```bash
npm run build
```
- The production-ready files will be in the `dist` folder.

### 5. Preview the production build
```bash
npm run preview
```

## Linting
To check code quality and catch errors:
```bash
npm run lint
```

## Project Structure
```
PDF-Demo/
├── src/
│   ├── components/      # React components (PDF upload, list, viewer, thumbnail)
│   ├── types/           # TypeScript types
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # React entry point
│   └── index.css        # Tailwind CSS imports
├── index.html           # App HTML entry
├── package.json         # Project metadata and scripts
├── tailwind.config.js   # Tailwind CSS config
├── postcss.config.js    # PostCSS config
├── vite.config.ts       # Vite config
└── ...
```

## Notes & Troubleshooting
- **PDF.js** is loaded dynamically from CDN for PDF rendering and thumbnail generation. No extra setup is needed.
- **Tailwind CSS** is used for styling. You can customize styles in `tailwind.config.js` and `src/index.css`.
- **Local Storage**: Uploaded PDFs are remembered in your browser. To clear, use your browser's local storage tools.
- **File Size Limit**: Each PDF must be under 10MB.
- **Supported Browsers**: Latest versions of Chrome, Firefox, Edge, and Safari are recommended.

## License
MIT 
