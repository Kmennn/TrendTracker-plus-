import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, TrendingUp, Twitter } from 'lucide-react';
import Chart from './Chart';
import StatCard from './StatCard';
import DashboardGlobe from './DashboardGlobe';
import AnimatedNumber from './AnimatedNumber';
import './Analytics.css';

const Analytics = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const statCards = [
    { icon: <TrendingUp size={18} />, label: "54k trending posts" },
    { icon: <Instagram size={18} />, label: "35m total views" },
    { icon: <Twitter size={18} />, label: "17k viral posts" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-800/50 rounded-xl p-8 mb-8 border border-gray-700/50"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side */}
        <motion.div variants={itemVariants} className="w-full lg:w-2/3">
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white mb-3">Powerful Analytics for Social Media Trends</motion.h2>
          <motion.p variants={itemVariants} className="text-gray-400 mb-8">
            Create and analyze trend lists with advanced metrics that track engagement across platforms. Our tools are built for content creators and social media professionals.
          </motion.p>

          <div className="relative mb-8 flex items-center justify-center" style={{ minHeight: '320px' }}>
            <div className="absolute inset-0 z-0">
              <DashboardGlobe />
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <motion.h1
                variants={itemVariants}
                className="text-7xl font-bold text-white mb-2 glowing-text"
              >
                <AnimatedNumber value={83000000} />M
              </motion.h1>
              <motion.p variants={itemVariants} className="text-gray-400 text-lg">
                Views across all platforms
              </motion.p>
            </div>
          </div>
          
          <motion.div
            variants={containerVariants}
            className="flex flex-wrap gap-4 text-sm justify-center lg:justify-start"
          >
            {statCards.map((card, index) => (
              <motion.div key={index} variants={itemVariants}>
                <StatCard icon={card.icon} label={card.label} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          variants={containerVariants}
          className="w-full lg:w-1/3 space-y-8"
        >
          <motion.div variants={itemVariants} className="bg-gray-900/50 p-6 rounded-lg">
            <h3 className="font-semibold text-white mb-4">Trend Analytics</h3>
            <Chart type="bar" data={{
              labels: ['Likes', 'Replies', 'Shares', 'Engagement'],
              values: [30, 45, 35, 90],
            }} />
          </motion.div>
          <motion.div variants={itemVariants} className="bg-gray-900/50 p-6 rounded-lg">
            <h3 className="font-semibold text-white mb-4">Social Media Trend Suite</h3>
            <Chart type="bar" data={{
              labels: ['January', 'February', 'March', 'April', 'May'],
              values: [42, 74, 51, 88, 39],
            }} />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;
