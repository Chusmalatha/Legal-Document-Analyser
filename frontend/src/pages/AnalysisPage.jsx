import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileCheck, AlertTriangle, FileText } from 'lucide-react';
import FloatingChatbot from '../components/FloatingChatbot.jsx';
import { useEffect } from 'react';

export default function AnalysisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  useEffect(() => {
    if (!result) {
      navigate('/');
    }
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Upload</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Analysis Complete
          </h1>
          <p className="text-gray-400 text-lg">
            Here's what we found in your document
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6"
        >
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(16, 185, 129, 0.3)' }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-emerald-500/30 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-400">Clause Type</h2>
            </div>
            <p className="text-white text-xl font-medium bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
              {result.clause_type}
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(59, 130, 246, 0.3)' }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-blue-500/30 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-blue-400">Summary</h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
  {typeof result.summary === "string"
    ? result.summary.replace(/^SUMMARY:\s*/i, "")
    : result.summary}
</p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(239, 68, 68, 0.3)' }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-red-500/30 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-red-400">Legal Risks</h2>
            </div>
            
            <div className="space-y-3">
  {Array.isArray(result.risk_sentences) ? (
    result.risk_sentences.length > 0 ? (
      result.risk_sentences.map((risk, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + index * 0.1 }}
          className="flex items-start gap-3 bg-red-500/10 rounded-lg p-4 border border-red-500/20"
        >
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-gray-300 text-base">{risk}</p>
        </motion.div>
      ))
    ) : (
      <p className="text-gray-400 italic">No significant risks detected</p>
    )
  ) : typeof result.risk_sentences === "string" ? (
    result.risk_sentences
      .split("Risk:")
      .filter(r => r.trim() !== "")
      .map((risk, index) => (
        <motion.div 
          key={index}
          className="flex items-start gap-3 bg-red-500/10 rounded-lg p-4 border border-red-500/20"
        >
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-gray-300 text-base">{risk.trim()}</p>
        </motion.div>
      ))
  ) : (
    <p className="text-gray-400 italic">No significant risks detected</p>
  )}
</div>
            
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            Have questions about this analysis? Click the chat icon to ask our AI assistant
          </p>
        </motion.div>
      </div>

      <FloatingChatbot />
    </div>
  );
}
