/**
 * DashboardShowcase - Product Preview Section
 * 
 * Displays a glassmorphism mockup of the TrendTracker+ dashboard
 * with animated data visualizations and scroll-triggered reveal.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Globe, Zap } from 'lucide-react';

// Mini chart component
const MiniChart = ({ data, color, delay = 0 }) => (
  <motion.div 
    className="flex items-end gap-1 h-12"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: delay + 0.3, duration: 0.5 }}
  >
    {data.map((value, i) => (
      <motion.div
        key={i}
        className="w-2 rounded-t"
        style={{ 
          backgroundColor: color,
          height: `${value}%`,
        }}
        initial={{ height: 0 }}
        whileInView={{ height: `${value}%` }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.4 + i * 0.05, duration: 0.4 }}
      />
    ))}
  </motion.div>
);

// Trend item row
const TrendRow = ({ name, change, isPositive, delay = 0 }) => (
  <motion.div 
    className="flex items-center justify-between py-2 border-b border-white/5"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.4 }}
  >
    <span className="text-gray-300 text-sm">{name}</span>
    <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
      {isPositive ? '+' : ''}{change}%
    </span>
  </motion.div>
);

// Stat card
const StatCard = ({ icon: Icon, label, value, color, delay = 0 }) => (
  <motion.div 
    className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.4 }}
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2`} style={{ backgroundColor: color + '30' }}>
      <Icon className="w-4 h-4" style={{ color }} />
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-xs text-gray-400">{label}</p>
  </motion.div>
);

export function DashboardShowcase() {
  const chartData = [45, 60, 35, 80, 55, 70, 90, 65, 85, 75, 95, 80];
  const trendData = [
    { name: 'AI Technology', change: 24.5, isPositive: true },
    { name: 'Sustainable Fashion', change: 18.3, isPositive: true },
    { name: 'Crypto Markets', change: -5.2, isPositive: false },
    { name: 'Remote Work', change: 12.8, isPositive: true },
  ];
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-4">
            Powerful Dashboard
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Real-time analytics and insights at your fingertips
          </p>
        </motion.div>
        
        {/* Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Outer glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50" />
          
          {/* Main dashboard container */}
          <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
            
            {/* Dashboard header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">TrendTracker+ Dashboard</h3>
                  <p className="text-gray-400 text-xs">Real-time India Trends</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>
            
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard icon={TrendingUp} label="Active Trends" value="1,234" color="#a78bfa" delay={0.1} />
              <StatCard icon={BarChart3} label="Data Points" value="50K+" color="#22d3ee" delay={0.2} />
              <StatCard icon={Globe} label="Regions" value="28" color="#34d399" delay={0.3} />
              <StatCard icon={Zap} label="Live Updates" value="24/7" color="#fbbf24" delay={0.4} />
            </div>
            
            {/* Main content grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Chart panel */}
              <motion.div 
                className="md:col-span-2 bg-white/5 rounded-xl p-5 border border-white/5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">Trend Velocity</h4>
                  <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded">Live</span>
                </div>
                <div className="flex items-end gap-1 h-32">
                  {chartData.map((value, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t opacity-80"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${value}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                    />
                  ))}
                </div>
              </motion.div>
              
              {/* Trends list */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                <h4 className="text-white font-medium mb-4">Top Trending</h4>
                {trendData.map((trend, i) => (
                  <TrendRow key={i} {...trend} delay={0.5 + i * 0.1} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default DashboardShowcase;
