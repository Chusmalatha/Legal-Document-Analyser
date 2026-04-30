import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UploadBox from '../components/UploadBox';
import LoadingSpinner from '../components/LoadingSpinner';
import { uploadDocument } from '../api/client';
import { Scale } from 'lucide-react';

export default function HomePage() {
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

 const handleFileSelect = async (file) => {
  setIsUploading(true);

  // ✅ CLEAR OLD CHAT WHEN NEW PDF IS UPLOADED
  sessionStorage.removeItem("chat_messages");

  try {
    const result = await uploadDocument(file);
    navigate('/analysis', { state: { result } });
  } catch (error) {
    console.error('Upload failed:', error);
    alert('Failed to analyze document. Please try again.');
  } finally {
    setIsUploading(false);
  }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-6"
          >
            <Scale className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400"
          >
            AI Legal Document Analyzer
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-400 mb-8"
          >
            Upload legal documents and understand them instantly
          </motion.p>
        </motion.div>

        {isUploading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <LoadingSpinner />
            <p className="text-white text-lg mt-6">Analyzing your document...</p>
            <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <UploadBox onFileSelect={handleFileSelect} isUploading={isUploading} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-gray-500 text-sm"
        >
          <p>Supported format: PDF • Maximum size: 10MB</p>
        </motion.div>
      </div>
    </div>
  );
}
