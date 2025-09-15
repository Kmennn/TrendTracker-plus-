import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, BarChart3, Globe, Brain, Users, Star, Briefcase, Lightbulb, Target } from 'lucide-react';
import Button from '../components/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: TrendingUp, title: 'Real-time Trends', desc: 'Track emerging trends as they happen' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Deep insights with interactive visualizations' },
    { icon: Globe, title: 'Global Coverage', desc: 'Worldwide trend monitoring and analysis' },
    { icon: Brain, title: 'AI-Powered', desc: 'Smart recommendations and predictions' },
    { icon: Users, title: 'Team Collaboration', desc: 'Share insights and work together' },
    { icon: Star, title: 'Custom Reports', desc: 'Generate professional trend reports' }
  ];

  const useCases = [
    { icon: Briefcase, title: 'Market Researchers', desc: 'Identify new market opportunities and validate hypotheses with real-time data.' },
    { icon: Target, title: 'Business Strategists', desc: 'Monitor competitive landscape and inform strategic decisions with trend analysis.' },
    { icon: Lightbulb, title: 'Product Managers', desc: 'Discover unmet user needs and inspire new feature development.' }
  ];

  const starField = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    opacity: Math.random() * 0.8 + 0.2
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative overflow-hidden">
      {/* Animated Star Field */}
      <div className="absolute inset-0">
        {starField.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Cosmic Glow Effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">TrendTracker+</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-300 hover:text-purple-300 transition-colors font-medium">Features</a>
          <a href="#use-cases" className="text-gray-300 hover:text-purple-300 transition-colors font-medium">Use Cases</a>
          <a href="#insights" className="text-gray-300 hover:text-purple-300 transition-colors font-medium">Insights</a>
          <Button
            variant="outline"
            onClick={() => navigate('/login')}
            className="border-purple-400 text-purple-300 hover:bg-purple-400 hover:text-white"
          >
            Login
          </Button>
          <Button
            onClick={() => navigate('/signup')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25"
          >
            Sign Up
          </Button>
        </div>
      </nav>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center py-20 px-6 max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            Discover India's
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Trending Universe
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
        >
          Advanced analytics platform for strategic trend discovery across India’s digital landscape.
          Harness AI-powered insights to navigate tomorrow’s opportunities today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <Button
            size="lg"
            onClick={() => navigate('/signup')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl shadow-purple-500/25 text-lg px-8 py-4"
          >
            <Star className="w-5 h-5 mr-2" />
            Start Exploring
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="border-2 border-purple-400 text-purple-300 hover:bg-purple-400 hover:text-white shadow-lg text-lg px-8 py-4"
          >
            <Globe className="w-5 h-5 mr-2" />
            View Live Trends
          </Button>
        </motion.div>
      </motion.section>

      <section id="features" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-4">
            Cosmic Intelligence Features
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Navigate India’s digital trends with stellar precision and AI-powered insights
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-shadow">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-purple-300 transition-colors">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="use-cases" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-4">
            Built for Visionaries
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Empowering professionals to discover, analyze, and act on trends.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-purple-500/20">
                <useCase.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">{useCase.title}</h3>
              <p className="text-gray-400">{useCase.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="insights" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-4">
            From Data to Decisions
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Our platform transforms scattered signals into clear, actionable insights, helping you to not just see the future, but shape it.
          </p>
        </motion.div>
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-12"
        >
            <p className="text-2xl text-center text-white leading-relaxed">
                "TrendTracker+ has revolutionized our market analysis process. The AI-powered insights allow us to anticipate market shifts with incredible accuracy. It's an indispensable tool for our strategy team."
            </p>
            <p className="text-right mt-6 text-purple-300 font-semibold">— Virendra Mahajan</p>
        </motion.div>
      </section>

      <section className="relative z-10 py-20 px-6 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-6">
              Ready to Explore the Trend Universe?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of analysts and strategists using TrendTracker+ to navigate India’s digital landscape
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Button
              size="xl"
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-2xl shadow-purple-500/25 text-xl px-12 py-6"
            >
              <Star className="w-6 h-6 mr-3" />
              Begin Your Journey
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
