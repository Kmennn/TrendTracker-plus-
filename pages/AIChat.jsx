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
      content: 'Hello! I\'m your AI trend analyst, powered by Google\'s Gemini. I can help you understand market trends, analyze data, and provide strategic insights. What would you like to explore today?',
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

  const predefinedResponses = {
    'What are the top emerging trends in AI technology?': 'The AI landscape is evolving rapidly. Key trends include the rise of Generative AI, advancements in Explainable AI (XAI) to build more transparent models, and the increasing adoption of AI in edge computing for real-time processing. We\'re also seeing significant progress in multimodal AI, which can understand and process information from various sources like text, images, and audio.',
    'Analyze the growth potential of sustainable energy': 'The growth potential for sustainable energy is immense. Falling costs of solar and wind power, coupled with increasing government incentives and growing public awareness of climate change, are driving a massive shift away from fossil fuels. Key areas to watch are energy storage solutions, green hydrogen, and smart grid technologies, which are crucial for ensuring a stable and reliable supply of renewable energy.',
    'Compare remote work trends across different regions': 'Remote work adoption varies significantly across regions. North America and Europe have the highest rates, with many companies embracing a hybrid or fully remote model. In Asia, the trend is growing, but office culture remains strong in many countries. Latin America is also seeing a steady increase in remote work, driven by the tech industry. It\'s important to consider cultural norms and infrastructure when analyzing these trends.',
    'What factors drive viral content on social media?': 'Viral content is often a mix of art and science. Key factors include emotional appeal (humor, awe, anger), social currency (making people feel in-the-know), and practical value (useful information or tips). Timing and a bit of luck also play a role. Understanding your target audience and the platform\'s algorithm is crucial for increasing the chances of your content going viral.',
    'Predict the future of electric vehicle adoption': 'The future of electric vehicle (EV) adoption looks very promising. We predict that by 2030, EVs will account for over 50% of new car sales in many developed countries. This growth is driven by improving battery technology, expanding charging infrastructure, and government regulations phasing out internal combustion engines. However, challenges like raw material sourcing and grid capacity need to be addressed to ensure a smooth transition.'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    // Simulate a delay for a more realistic typing effect
    setTimeout(() => {
      const responseContent = predefinedResponses[inputMessage.trim()] || 'I am a simplified AI assistant. I can provide responses to the suggested questions. For other questions, I\'ll give you this default response. Try asking one of the suggested questions!';

      const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: responseContent,
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
              <p className="text-gray-400">Powered by Google Gemini</p>
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
                  <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
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
                  <span className="text-green-400 font-semibold">Dynamic</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Model:</span>
                  <span className="text-purple-400 font-semibold">Gemini 1.5</span>
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
