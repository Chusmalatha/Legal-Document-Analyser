import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FloatingChatbot() {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate('/chat')}
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg flex items-center justify-center z-50"
      whileHover={{ scale: 1.1, boxShadow: '0 0 40px rgba(16, 185, 129, 0.8)' }}
      whileTap={{ scale: 0.9 }}
      animate={{
        y: [0, -10, 0],
        boxShadow: [
          '0 10px 30px rgba(16, 185, 129, 0.4)',
          '0 15px 40px rgba(16, 185, 129, 0.6)',
          '0 10px 30px rgba(16, 185, 129, 0.4)',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <MessageCircle className="w-8 h-8 text-white" />
    </motion.button>
  );
}
