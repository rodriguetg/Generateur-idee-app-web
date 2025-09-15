import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { ApiConfig } from '../types';
import { aiService } from '../services/aiService';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
}

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  apiConfig: ApiConfig;
  context?: {
    step: string;
    idea?: any;
  };
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onToggle, apiConfig, context }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '👋 Salut ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickSuggestions = [
    "Comment améliorer mon idée ?",
    "Analyser le potentiel marché",
    "Suggestions de fonctionnalités",
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const prompt = `
    Contexte actuel:
    - Étape: ${context?.step || 'Inconnue'}
    - Idée: ${context?.idea?.title || 'Non définie'}
    - Description: ${context?.idea?.description || 'Non définie'}

    Question de l'utilisateur: "${inputValue}"

    Réponds de manière concise et utile en tant qu'expert en développement de produits. Utilise le format Markdown.
    `;

    const response = await aiService.generate({ prompt, config: apiConfig });

    let aiResponseContent = "Désolé, je n'ai pas pu générer de réponse. Veuillez vérifier votre configuration API ou réessayer.";
    if (response.success && response.content) {
      aiResponseContent = response.content;
    }
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: aiResponseContent,
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    // Automatically send message on quick suggestion click
    const userMessage: Message = { id: Date.now().toString(), type: 'user', content: suggestion };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Fake a small delay then send
    setTimeout(() => {
        const prompt = `
        Contexte actuel:
        - Étape: ${context?.step || 'Inconnue'}
        - Idée: ${context?.idea?.title || 'Non définie'}
        - Description: ${context?.idea?.description || 'Non définie'}

        Question de l'utilisateur: "${suggestion}"

        Réponds de manière concise et utile en tant qu'expert en développement de produits. Utilise le format Markdown.
        `;
        aiService.generate({ prompt, config: apiConfig }).then(response => {
            let aiResponseContent = "Désolé, je n'ai pas pu générer de réponse. Veuillez vérifier votre configuration API ou réessayer.";
            if (response.success && response.content) {
                aiResponseContent = response.content;
            }
            const aiMessage: Message = { id: (Date.now() + 1).toString(), type: 'ai', content: aiResponseContent };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        });
    }, 500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <span className="font-medium">Assistant IA</span>
        </div>
        <button
          onClick={onToggle}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'ai' && <Bot className="h-5 w-5 mt-1 text-purple-600 flex-shrink-0" />}
            <div
              className={`max-w-[85%] p-3 rounded-lg prose prose-sm max-w-none ${
                message.type === 'user'
                  ? 'bg-purple-600 text-white order-last prose-invert'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <ReactMarkdown>
                {message.content}
              </ReactMarkdown>
            </div>
            {message.type === 'user' && <User className="h-5 w-5 mt-1 text-gray-400 flex-shrink-0" />}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-lg max-w-[80%]">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-purple-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length < 3 && (
        <div className="px-4 pb-2 border-t pt-2">
          <div className="text-xs text-gray-500 mb-2">Suggestions :</div>
          <div className="flex flex-wrap gap-1">
            {quickSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleQuickSuggestion(suggestion)}
                className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full hover:bg-purple-100 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Posez votre question..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAssistant;
