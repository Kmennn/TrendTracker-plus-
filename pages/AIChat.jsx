import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Bot, User, Sparkles, TrendingUp, BarChart3, Lightbulb, Copy, ThumbsUp, ThumbsDown, RefreshCw
} from 'lucide-react';
import Button from '../components/Button';
import { db } from '../src/firebaseConfig';
import { ref, onValue } from 'firebase/database';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1, type: 'ai', content: 'Hello! I\'m your AI trend analyst, powered by Google\'s Gemini. I can help you understand market trends, analyze data, and provide strategic insights. What would you like to explore today?', timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [trends, setTrends] = useState([]);

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

  useEffect(() => {
    const trendsRef = ref(db, 'trends');
    onValue(trendsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTrends(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', content: inputMessage, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const responseContent = predefinedResponses[inputMessage.trim()] || 'I am a simplified AI assistant. I can only respond to the suggested questions. Please select one of them to get a detailed answer.';
      const aiResponse = { id: Date.now() + 1, type: 'ai', content: responseContent, timestamp: new Date() };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (timestamp) => new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(timestamp);

  return (
    <div className="w-full max-w-7xl mx-auto">
        <header className="mb-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg-purple-500/30">
                <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">AI Trend Analyst</h1>
                <p className="text-gray-400">Powered by Google Gemini</p>
            </div>
            </div>
            <Button onClick={() => setMessages(messages.slice(0, 1))}><RefreshCw className="w-4 h-4 mr-2" />New Chat</Button>
        </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl flex flex-col h-[650px]">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence>
                {messages.map((message) => (
                    <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start space-x-4 ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                        message.type === 'ai'
                        ? 'bg-gradient-to-br from-purple-600 to-pink-500'
                        : 'bg-white/10'
                    }`}>
                        {message.type === 'ai' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                    </div>
                    <div className={`max-w-xl ${message.type === 'user' ? 'text-right' : ''}`}>
                        <div className={`relative rounded-xl p-4 ${
                        message.type === 'ai'
                            ? 'bg-black/20 border border-white/10'
                            : 'bg-purple-600/50 border border-purple-500/50'
                        }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                        <div className={`flex items-center mt-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-gray-500 mr-4">{formatTime(message.timestamp)}</span>
                        {message.type === 'ai' && (
                            <div className="flex items-center space-x-2">
                            <button className="text-gray-500 hover:text-white"><Copy className="w-3 h-3" /></button>
                            <button className="text-gray-500 hover:text-green-400"><ThumbsUp className="w-3 h-3" /></button>
                            <button className="text-gray-500 hover:text-red-400"><ThumbsDown className="w-3 h-3" /></button>
                            </div>
                        )}
                        </div>
                    </div>
                    </motion.div>
                ))}
                </AnimatePresence>
                {isTyping && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                    <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-black/20 border border-white/10 rounded-xl p-4">
                    <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                    </div>
                </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-white/10 p-4">
                <div className="relative">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me about trends, market analysis, or strategic insights..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-4 pr-14 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                    <Send className="w-5 h-5" />
                </Button>
                </div>
            </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center"><Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />Suggested Questions</h3>
            <div className="space-y-2">
                {suggestedQuestions.map((q, i) => (
                <button key={i} onClick={() => setInputMessage(q)} className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
                    {q}
                </button>
                ))}
            </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">AI Capabilities</h3>
            <div className="space-y-3 text-sm">
                <div className="flex items-center"><TrendingUp className="w-4 h-4 mr-3 text-green-400" /><span className="text-gray-300">Trend Analysis</span></div>
                <div className="flex items-center"><BarChart3 className="w-4 h-4 mr-3 text-blue-400" /><span className="text-gray-300">Data Insights</span></div>
                <div className="flex items-center"><Sparkles className="w-4 h-4 mr-3 text-purple-400" /><span className="text-gray-300">Predictions</span></div>
                <div className="flex items-center"><Lightbulb className="w-4 h-4 mr-3 text-yellow-400" /><span className="text-gray-300">Strategic Advice</span></div>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default AIChat;
