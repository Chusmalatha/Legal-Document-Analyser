import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText } from 'lucide-react';

export default function UploadBox({ onFileSelect, isUploading }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      setSelectedFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
          isDragging
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-gray-600 bg-gray-800/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            animate={{
              y: isDragging ? -10 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {selectedFile ? (
              <FileText className="w-16 h-16 text-emerald-500 mb-4" />
            ) : (
              <Upload className="w-16 h-16 text-gray-400 mb-4" />
            )}
          </motion.div>

          {selectedFile ? (
            <div className="mb-4">
              <p className="text-white text-lg font-medium">{selectedFile.name}</p>
              <p className="text-gray-400 text-sm mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <>
              <p className="text-white text-lg font-medium mb-2">
                Drag & drop your PDF here
              </p>
              <p className="text-gray-400 text-sm mb-4">or</p>
            </>
          )}

          {!selectedFile && (
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Files
            </motion.button>
          )}
        </div>
      </motion.div>

      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex justify-center"
        >
          <motion.button
            onClick={handleUpload}
            disabled={isUploading}
            className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${
              isUploading
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-emerald-500/50'
            }`}
            whileHover={!isUploading ? { scale: 1.05, boxShadow: '0 0 30px rgba(16, 185, 129, 0.6)' } : {}}
            whileTap={!isUploading ? { scale: 0.95 } : {}}
          >
            {isUploading ? 'Analyzing Document...' : 'Analyze Document'}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
