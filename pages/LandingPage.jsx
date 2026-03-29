/**
 * LandingPage - Cinematic 3D Landing Experience
 * 
 * Architecture:
 * - Layer 1 (z-0): Background gradient
 * - Layer 2 (z-10): R3F Canvas with 3D scene
 * - Layer 3 (z-30): Glass UI content
 * 
 * Scroll-driven camera + cursor parallax for desktop
 */

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { 
  TrendingUp, Globe, Brain, Users, Star, 
  Briefcase, Lightbulb, Target, BarChart3, Sparkles,
  ChevronDown, ArrowDown
} from 'lucide-react';

// Landing components
import { LandingCanvas, GlassCard, MagneticButton, DashboardShowcase } from '../components/landing';

// Hooks
import { useScrollCamera } from '../hooks/useScrollCamera';
import { useCursorParallax } from '../hooks/useCursorParallax';

// Motion utilities
import { isMobileDevice, prefersReducedMotion } from '../motion/uiCapabilities';

const LandingPage = () => {
  const navigate = useNavigate();
  const lenisRef = useRef(null);
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  
  const isMobile = isMobileDevice();
  const reducedMotion = prefersReducedMotion();
  
  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (reducedMotion) {
      setIsReady(true);
      return;
    }
    
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    
    lenisRef.current = lenis;
    
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    setIsReady(true);
    
    return () => {
      lenis.destroy();
    };
  }, [reducedMotion]);
  
  // Scroll-driven camera
  const camera = useScrollCamera(lenisRef);
  
  // Cursor parallax (desktop only)
  const cursor = useCursorParallax({ intensity: 0.5, smoothing: 0.08 });
  
  // Feature cards data
  const features = [
    { icon: TrendingUp, title: 'Real-time Trends', desc: 'Track emerging trends as they happen across India' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Deep insights with interactive visualizations' },
    { icon: Globe, title: 'Global Coverage', desc: 'Worldwide trend monitoring and analysis' },
    { icon: Brain, title: 'AI-Powered', desc: 'Smart recommendations and predictions' },
    { icon: Users, title: 'Team Collaboration', desc: 'Share insights and work together' },
    { icon: Star, title: 'Custom Reports', desc: 'Generate professional trend reports' }
  ];
  
  // Use cases data
  const useCases = [
    { icon: Briefcase, title: 'Market Researchers', desc: 'Identify new market opportunities with real-time data.' },
    { icon: Target, title: 'Business Strategists', desc: 'Monitor competitive landscape and inform decisions.' },
    { icon: Lightbulb, title: 'Product Managers', desc: 'Discover unmet user needs and inspire features.' }
  ];
  
  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    },
  };
  
  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#030712] relative"
    >
      {/* Layer 1: 3D Canvas (Fixed, behind everything) */}
      {isReady && (
        <LandingCanvas
          cameraPosition={camera.position}
          cameraLookAt={camera.lookAt}
          cursorX={cursor.normalizedX}
          cursorY={cursor.normalizedY}
          scrollProgress={camera.progress}
        />
      )}
      
      {/* Layer 2: UI Content (Scrollable, on top) */}
      <div className="relative z-20">
        
        {/* Navigation - Glassmorphism Pill Style (Curated.Media) */}
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 px-2 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl">
            {/* Logo */}
            <div className="flex items-center gap-2 px-4 py-1">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold hidden sm:block">TrendTracker+</span>
            </div>
            
            {/* Nav Links */}
            <div className="hidden md:flex items-center">
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 text-white/80 hover:text-white transition-colors text-sm font-medium">
                  Product
                  <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  <a href="#features" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 text-sm">
                    <TrendingUp className="w-4 h-4" /> Real-time Trends
                  </a>
                  <a href="#features" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 text-sm">
                    <BarChart3 className="w-4 h-4" /> Analytics
                  </a>
                </div>
              </div>
              
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 text-white/80 hover:text-white transition-colors text-sm font-medium">
                  Channels
                  <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  <a href="#use-cases" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 text-sm">
                    <Globe className="w-4 h-4" /> Social Media
                  </a>
                  <a href="#use-cases" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 text-sm">
                    <Brain className="w-4 h-4" /> News
                  </a>
                </div>
              </div>
              
              <a href="#use-cases" className="px-4 py-2 text-white/80 hover:text-white transition-colors text-sm font-medium">Resources</a>
              <a href="#insights" className="px-4 py-2 text-white/80 hover:text-white transition-colors text-sm font-medium">Stories</a>
            </div>
            
            {/* Right side buttons */}
            <div className="flex items-center gap-2 pl-2">
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-white/80 hover:text-white transition-colors text-sm font-medium hidden sm:block"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started — It's Free
              </button>
            </div>
          </div>
        </nav>
        
        {/* Hero Section - LEFT ALIGNED like Curated.Media */}
        <section className="min-h-screen flex items-center px-6 md:px-12 lg:px-20 pt-24">
          {/* Left side content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            {/* Main Heading - LEFT ALIGNED */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 leading-[1.1]"
            >
              Introducing
              <motion.span 
                className="block bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent"
              >
                TrendTracker+
              </motion.span>
            </motion.h1>
            
            {/* Tagline */}
            <motion.p 
              variants={itemVariants}
              className="text-lg text-purple-300/80 mb-8 font-medium"
            >
              India's Trend Discovery Platform®
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-3">
              <MagneticButton 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/signup')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started — It's Free
              </MagneticButton>
              <MagneticButton 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/login')}
              >
                Book a Call
              </MagneticButton>
            </motion.div>
          </motion.div>
          
          {/* Scroll down indicator - RIGHT SIDE like Curated.Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="fixed bottom-8 right-8 z-30"
          >
            <a 
              href="#features"
              className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all group"
            >
              <span className="text-white/80 text-sm font-medium">
                Scroll down<br/>
                <span className="text-purple-300">& discover</span>
              </span>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <ArrowDown className="w-4 h-4 text-white animate-bounce" />
              </div>
            </a>
          </motion.div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-4">
                Cosmic Intelligence Features
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Navigate India's digital trends with stellar precision and AI-powered insights
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="h-full">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-purple-500/20">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Dashboard Showcase Section */}
        <section id="dashboard">
          <DashboardShowcase />
        </section>
        
        {/* Use Cases Section */}
        <section id="use-cases" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-4">
                Built for Visionaries
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
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
                >
                  <GlassCard className="text-center h-full">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-purple-500/20">
                      <useCase.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">{useCase.title}</h3>
                    <p className="text-gray-400">{useCase.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonial Section */}
        <section id="insights" className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-4">
                From Data to Decisions
              </h2>
              <p className="text-gray-500 text-lg">
                Our platform transforms scattered signals into clear, actionable insights.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <GlassCard padding="p-10" className="text-center">
                <p className="text-xl md:text-2xl text-white leading-relaxed mb-6">
                  "TrendTracker+ has revolutionized our market analysis process. The AI-powered insights allow us to anticipate market shifts with incredible accuracy. It's an indispensable tool for our strategy team."
                </p>
                <p className="text-purple-300 font-semibold">— Virendra Mahajan</p>
              </GlassCard>
            </motion.div>
          </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-left max-w-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-6">
                Ready to Explore the Trend Universe?
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-lg">
                Join thousands of analysts and strategists using TrendTracker+ to navigate India's digital landscape
              </p>
              
              <div className="flex justify-start">
                <MagneticButton
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/signup')}
                  icon={<Star className="w-5 h-5" />}
                  className="text-lg px-10 py-5 shadow-xl shadow-purple-500/20"
                >
                  Begin Your Journey
                </MagneticButton>
              </div>
            </motion.div>
            
            {/* Right side is reserved for the Avatar resting place */}
            <div className="hidden md:block w-1/3"></div>
          </div>
        </section>
        
        {/* Footer spacer */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default LandingPage;
