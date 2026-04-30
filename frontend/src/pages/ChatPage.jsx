import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Copy, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../api/client';


const navEntries = performance.getEntriesByType("navigation");

if (navEntries.length > 0 && navEntries[0].type === "reload") {
  sessionStorage.removeItem("chat_messages");
}


export default function ChatPage() {

  // const [messages, setMessages] = useState(() => {
  //   const saved = sessionStorage.getItem("chat_messages");
  //   return saved
  //     ? JSON.parse(saved)
  //     : [
  //       {
  //         id: "1",
  //         role: "assistant",
  //         content:
  //           "Hello! I'm your AI legal assistant. Ask me anything about legal documents, contracts, or regulations.",
  //         timestamp: new Date(),
  //       },
  //     ];
  // });


 const [messages, setMessages] = useState(() => {
  const saved = sessionStorage.getItem("chat_messages");

  return saved
    ? JSON.parse(saved)
    : [
        {
          id: "1",
          role: "assistant",
          content: "Hello! I'm your AI legal assistant.",
        },
      ];
});

  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

 


  useEffect(() => {
    sessionStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // SEND MESSAGE
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const messageText = inputMessage;
    setInputMessage('');

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await sendChatMessage(messageText);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error('Chat error:', error);

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Enter key handler
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Copy messages
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
      {/* TOP BAR */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 px-4 py-4 flex items-center gap-4 sticky top-0 z-40"
      >
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 hover:bg-gray-800 rounded-lg transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </motion.button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>

          <div className="hidden sm:block">
            <h1 className="text-white font-semibold text-sm">Lexi AI</h1>
            <p className="text-gray-500 text-xs">Always ready to help</p>
          </div>
        </div>

        {/* ✅ CLEAR CHAT BUTTON HERE */}
        <button
          onClick={() => {
            sessionStorage.removeItem("chat_messages");
            setMessages([
              {
                id: "1",
                role: "assistant",
                content:
                  "Hello! I'm your AI legal assistant. Ask me anything about legal documents, contracts, or regulations.",
                timestamp: new Date(),
              },
            ]);
          }}
          className="text-sm text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1 rounded-lg hover:bg-red-500/10 transition"
        >
          Clear Chat
        </button>
      </motion.div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 w-full">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-xs">AI</span>
                </div>
              )}

              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`group max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-4 relative ${message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none'
                    : 'bg-gray-800 text-gray-100 border border-gray-700/50 rounded-bl-none'
                  }`}
              >
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>

                {message.role === 'assistant' && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    onClick={() => copyToClipboard(message.content, message.id)}
                    className="absolute top-3 right-3 p-2 hover:bg-gray-700/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Copy message"
                  >
                    {copiedId === message.id ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </motion.button>
                )}
              </motion.div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-xs">U</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>

            <div className="bg-gray-800 border border-gray-700/50 rounded-2xl p-4 flex items-center gap-2 rounded-bl-none">
              <motion.div
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* MESSAGE INPUT */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gray-900/80 backdrop-blur-md border-t border-gray-700/50 p-4 sticky bottom-0"
      >
        <div className="w-full flex gap-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Message Lexi AI..."
            rows="1"
            className="flex-1 bg-gray-800 text-white rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-700 resize-none"
            disabled={isTyping}
            style={{
              maxHeight: '120px',
              minHeight: '44px',
              overflowY: 'auto',
            }}
          />

          

          <motion.button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className={`px-5 py-3 rounded-2xl font-medium transition-all flex-shrink-0 ${inputMessage.trim() && !isTyping
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/50'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            whileHover={inputMessage.trim() && !isTyping ? { scale: 1.05 } : {}}
            whileTap={inputMessage.trim() && !isTyping ? { scale: 0.95 } : {}}
            title="Send message (Enter)"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        <p className="text-gray-500 text-xs text-center mt-2">
          Press Shift + Enter for new line
        </p>
      </motion.div>
    </div>
  ); 
}