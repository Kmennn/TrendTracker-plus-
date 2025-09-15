import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  Lightbulb,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';
import Button from '../components/Button';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI trend analyst. I can help you understand market trends, analyze data, and provide strategic insights. What would you like to explore today?',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const suggestedQuestions = [
    'What are the top emerging trends in AI technology?',
    'Analyze the growth potential of sustainable energy',
    'Compare remote work trends across different regions',
    'What factors drive viral content on social media?',
    'Predict the future of electric vehicle adoption'
  ];
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const simulateAIResponse = (userMessage) => {
    const responses = {
      'ai': 'Based on current data trends, AI technology is experiencing unprecedented growth with a 300% increase in enterprise adoption. Key areas include generative AI, machine learning automation, and AI-powered analytics platforms.',
      'sustainable': 'Sustainable energy trends show strong momentum with solar and wind power leading adoption rates. Investment has increased 45% year-over-year, driven by policy changes and cost reductions.',
      'remote': 'Remote work has stabilized at 35% of the workforce, with hybrid models becoming the new standard. Productivity tools and collaboration platforms continue to see high demand.',
      'social': 'Viral content analysis reveals that authenticity, timing, and emotional resonance are key factors. Short-form video content has 67% higher engagement rates than static posts.',
      'electric': 'Electric vehicle adoption is projected to reach 30% market share by 2030, driven by infrastructure improvements, battery technology advances, and regulatory support.'
    };
    
    const lowerMessage = userMessage.toLowerCase();
    let response = 'That\'s an interesting question! Based on current trend analysis, I can provide insights on market patterns, growth trajectories, and strategic recommendations. Could you be more specific about what aspect you\'d like me to focus on?';
    
    Object.keys(responses).forEach(key => {
      if (lowerMessage.includes(key)) {
        response = responses[key];
      }
    });
    
    return response;
  };
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: simulateAIResponse(inputMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
  };
  
  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Trend Analyst</h1>
              <p className="text-gray-400">Get strategic insights and data-driven analysis</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl border border-gray-700 flex flex-col h-[600px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start space-x-3 ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.type === 'ai' 
                          ? 'bg-gradient-to-br from-purple-500 to-blue-500' 
                          : 'bg-gray-600'
                      }`}>
                        {message.type === 'ai' ? (
                          <Bot className="w-4 h-4 text-white" />
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                      
                      <div className={`flex-1 max-w-lg ${
                        message.type === 'user' ? 'text-right' : ''
                      }`}>
                        <div className={`rounded-lg p-4 inline-block ${
                          message.type === 'ai'
                            ? 'bg-gray-700 text-white'
                            : 'bg-purple-600 text-white'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                        
                        <div className={`flex items-center mt-2 ${
                           message.type === 'user' ? 'justify-end' : 'justify-between'
                        }`}>
                          <span className="text-xs text-gray-400">
                            {formatTime(message.timestamp)}
                          </span>
                          
                          {message.type === 'ai' && (
                            <div className="flex items-center space-x-2">
                              <button className="text-gray-400 hover:text-white transition-colors">
                                <Copy className="w-3 h-3" />
                              </button>
                              <button className="text-gray-400 hover:text-green-400 transition-colors">
                                <ThumbsUp className="w-3 h-3" />
                              </button>
                              <button className="text-gray-400 hover:text-red-400 transition-colors">
                                <ThumbsDown className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Input */}
              <div className="border-t border-gray-700 p-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me about trends, market analysis, or strategic insights..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Questions */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                Suggested Questions
              </h3>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
            
            {/* AI Capabilities */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">AI Capabilities</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Trend Analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">Data Insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Predictions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Strategic Advice</span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Session Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Messages:</span>
                  <span className="text-white font-semibold">{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Response Time:</span>
                  <span className="text-green-400 font-semibold">~1.2s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Accuracy:</span>
                  <span className="text-purple-400 font-semibold">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;