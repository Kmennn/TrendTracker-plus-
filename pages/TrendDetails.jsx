import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useParams } from 'react-router-dom';
import { TrendingUp, Bookmark, Share2, Download, MessageCircle, ExternalLink, Calendar, Globe, Tag } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Button from '../components/Button';

const TrendDetails = () => {
  const { regionName } = useParams();
  const location = useLocation();
  const { trend: overallTrend } = location.state || {};

  const [trend, setTrend] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (regionName && overallTrend) {
      // Simulate loading trend details based on region and trend
      setTrend({
        id: `${regionName}-${overallTrend.replace(/\s+/g, '-')}`,
        title: `${overallTrend} in ${regionName}`,
        description: `Analysis of the '${overallTrend}' trend in ${regionName}, exploring market adoption, investment, and future outlook.`,
        category: 'Technology',
        growth: `+${Math.floor(Math.random() * 50) + 10}%`,
        sentiment: 'positive',
        maturity: ['emerging', 'growing', 'mature'][Math.floor(Math.random() * 3)],
        impact: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        timeline: `${Math.floor(Math.random() * 6) + 6}-18 months`,
        regions: [regionName, 'Global'],
        tags: [overallTrend, regionName, 'Trending'],
        sources: [
          { title: `Report on ${overallTrend} in ${regionName}`, url: '#', date: '2024-01-15' },
          { title: `Market Analysis: ${regionName}`, url: '#', date: '2024-01-12' },
        ],
        metrics: {
          searchVolume: Array.from({ length: 7 }, (_, i) => ({
            month: new Date(2023, 6 + i, 1).toLocaleString('default', { month: 'short' }),
            volume: Math.floor(Math.random() * 50000) + 10000,
          })),
          maturityRadar: [
            { subject: 'Awareness', A: Math.floor(Math.random() * 80) + 20, fullMark: 100 },
            { subject: 'Adoption', A: Math.floor(Math.random() * 80) + 20, fullMark: 100 },
            { subject: 'Investment', A: Math.floor(Math.random() * 80) + 20, fullMark: 100 },
            { subject: 'Innovation', A: Math.floor(Math.random() * 80) + 20, fullMark: 100 },
            { subject: 'Market Size', A: Math.floor(Math.random() * 80) + 20, fullMark: 100 },
            { subject: 'Regulation', A: Math.floor(Math.random() * 80) + 20, fullMark: 100 },
          ]
        }
      });

      setComments([
        { id: 1, user: 'AI Analyst', avatar: 'https://ui-avatars.com/api/?name=AI+Analyst&background=6366f1&color=fff', comment: `The trend of ${overallTrend} in ${regionName} is showing significant promise.`, time: '2 hours ago' },
      ]);
    }
  }, [regionName, overallTrend]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        user: 'Current User',
        avatar: 'https://ui-avatars.com/api/?name=Current+User&background=f59e0b&color=fff',
        comment: newComment,
        time: 'Just now'
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  if (!trend) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white">Loading trend details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full text-sm font-medium">
                  {trend.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  trend.maturity === 'emerging' ? 'bg-green-600 text-green-100' :
                  trend.maturity === 'growing' ? 'bg-yellow-600 text-yellow-100' :
                  'bg-purple-600 text-purple-100'
                }`}>
                  {trend.maturity}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">{trend.title}</h1>
              <p className="text-gray-300 text-lg leading-relaxed">{trend.description}</p>
            </div>
            <div className="flex items-center space-x-3 ml-6">
              <Button
                variant={isBookmarked ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className="w-4 h-4 mr-2" />
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{trend.growth}</div>
              <div className="text-gray-400 text-sm">Growth Rate</div>
            </div>
            <div className_="text-center">
              <div className="text-2xl font-bold text-orange-400">{trend.impact}</div>
              <div className="text-gray-400 text-sm">Impact Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{trend.timeline}</div>
              <div className="text-gray-400 text-sm">Timeline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{trend.regions.length}</div>
              <div className="text-gray-400 text-sm">Active Regions</div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Growth Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Search Volume Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trend.metrics.searchVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Line type="monotone" dataKey="volume" stroke="#3B82F6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Maturity Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Trend Maturity Analysis</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={trend.metrics.maturityRadar}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                  <Radar name="Maturity" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Sources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Related Sources</h3>
              <div className="space-y-4">
                {trend.sources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{source.title}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-gray-400 text-sm flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {source.date}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {trend.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Regions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Active Regions</h3>
              <div className="space-y-2">
                {trend.regions.map((region, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <Globe className="w-4 h-4 mr-2 text-blue-400" />
                    {region}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Comments */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Discussion
              </h3>
              
              <div className="space-y-4 mb-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <img src={comment.avatar} alt={comment.user} className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white font-medium text-sm">{comment.user}</span>
                        <span className="text-gray-400 text-xs">{comment.time}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your thoughts..."
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <Button size="sm" onClick={handleAddComment} className="w-full">
                  Add Comment
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendDetails;
