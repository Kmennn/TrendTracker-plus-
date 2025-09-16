import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Bell, Bookmark, TrendingUp, ExternalLink, ArrowLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TrendCard from '../components/TrendCard';
import KeywordCard from '../components/KeywordCard';
import Button from '../components/Button';
import { db } from '../src/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Analytics from '../components/Analytics';
import NotificationPanel from '../components/NotificationPanel';
import FilterModal from '../components/FilterModal';
import AudienceDemographics from '../components/AudienceDemographics';
import InfluencerIdentification from '../components/InfluencerIdentification';
import CommunityDetection from '../components/CommunityDetection';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [trends, setTrends] = useState([]);
  const [topKeywords, setTopKeywords] = useState([]);
  const [todaysHighlight, setTodaysHighlight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [showAudience, setShowAudience] = useState(false);
  const [showInfluencers, setShowInfluencers] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);

 useEffect(() => {
    const trendsRef = ref(db, 'trends');
    const unsubscribe = onValue(trendsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const trendsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          growth: `+${Math.floor(Math.random() * 300)}%`,
          sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
          maturity: ['emerging', 'growing', 'mature', 'early'][Math.floor(Math.random() * 4)],
          description: `This is a description for ${data[key].keyword}`,
          metrics: { searchVolume: data[key].volume, changePercent: Math.floor(Math.random() * 300) }
        }));
 setTrends(trendsArray);
 console.log('Fetched Trends:', trendsArray); // Log fetched data
        setTopKeywords(trendsArray.slice(0, 5).map(t => ({
 id: t.id,
 keyword: t.keyword,
 volume: t.metrics.searchVolume,
 growth: t.growth
        })));
 if (trendsArray.length > 0) {
            setTodaysHighlight({
 id: trendsArray[0].id,
 title: trendsArray[0].keyword,
 description: trendsArray[0].description,
 growth: trendsArray[0].growth,
                growthValue: trendsArray[0].metrics.changePercent,
 impact: 'High',
 sectors: [trendsArray[0].category, 'Media', 'Marketing'],
 timeline: '6 months'
            });
        }
      }
 setIsLoading(false);
 });
 return () => unsubscribe(); // Clean up the listener
  }, []);
 
  // State to hold placeholder trend data
  const [placeholderTrends, setPlaceholderTrends] = useState([
    { id: '1', keyword: 'AI in Healthcare', category: 'Technology', growth: '+85%', sentiment: 'positive', maturity: 'early', description: 'This is a description for AI in Healthcare', metrics: { searchVolume: 15000, changePercent: 85 } },
 { id: '2', keyword: 'Generative Art', category: 'Art', growth: '+120%', sentiment: 'positive', maturity: 'growing', description: 'Exploring the rise of AI in creating art.', metrics: { searchVolume: 8000, changePercent: 120 } },
 { id: '3', keyword: 'Lo-fi Beats', category: 'Music', growth: '+50%', sentiment: 'neutral', maturity: 'mature', description: 'The enduring popularity of lo-fi music for focus and relaxation.', metrics: { searchVolume: 25000, changePercent: 50 } },
 { id: '4', keyword: 'Quantum Computing Breakthroughs', category: 'Science', growth: '+200%', sentiment: 'positive', maturity: 'emerging', description: 'Recent advancements in quantum computing technology.', metrics: { searchVolume: 10000, changePercent: 200 } },
 { id: '5', keyword: 'Esports Popularity', category: 'Sports', growth: '+75%', sentiment: 'positive', maturity: 'growing', description: 'The increasing global audience for competitive gaming.', metrics: { searchVolume: 30000, changePercent: 75 } },
 { id: '6', keyword: 'Sustainable Business Practices', category: 'Business', growth: '+100%', sentiment: 'positive', maturity: 'mature', description: 'Companies adopting environmentally friendly operations.', metrics: { searchVolume: 18000, changePercent: 100 } },
 { id: '7', keyword: 'NFT Art Market', category: 'Art', growth: '+90%', sentiment: 'neutral', maturity: 'early', description: 'The volatile but growing market for Non-Fungible Token art.', metrics: { searchVolume: 12000, changePercent: 90 } },
 { id: '8', keyword: 'Music Streaming Growth', category: 'Music', growth: '+60%', sentiment: 'positive', maturity: 'mature', description: 'Continued expansion of music streaming services.', metrics: { searchVolume: 50000, changePercent: 60 } },
 { id: '9', keyword: 'CRISPR Gene Editing', category: 'Science', growth: '+150%', sentiment: 'positive', maturity: 'growing', description: 'New applications and ethical considerations of gene editing.', metrics: { searchVolume: 9000, changePercent: 150 } },
 { id: '10', keyword: 'Fantasy Sports Betting', category: 'Sports', growth: '+40%', sentiment: 'neutral', maturity: 'mature', description: 'The intersection of fantasy sports and online betting.', metrics: { searchVolume: 22000, changePercent: 40 } },
 { id: '11', keyword: 'Remote Work Technologies', category: 'Business', growth: '+70%', sentiment: 'positive', maturity: 'mature', description: 'Tools and platforms enabling distributed teams.', metrics: { searchVolume: 28000, changePercent: 70 } },
 { id: '12', keyword: 'AI Ethics', category: 'Technology', growth: '+110%', sentiment: 'neutral', maturity: 'growing', description: 'Discussions and frameworks for responsible AI development.', metrics: { searchVolume: 13000, changePercent: 110 } },
    // Added more placeholder trends
 { id: '13', keyword: 'Plant-Based Diets', category: 'Food', growth: '+65%', sentiment: 'positive', maturity: 'growing', description: 'The increasing popularity of plant-based and vegan diets.', metrics: { searchVolume: 20000, changePercent: 65 } },
 { id: '14', keyword: 'Personalized Medicine', category: 'Science', growth: '+180%', sentiment: 'positive', maturity: 'emerging', description: 'Medical treatments tailored to individual patient characteristics.', metrics: { searchVolume: 11000, changePercent: 180 } },
 { id: '15', keyword: 'Renewable Energy Storage', category: 'Technology', growth: '+130%', sentiment: 'positive', maturity: 'growing', description: 'Advancements in battery and energy storage solutions.', metrics: { searchVolume: 17000, changePercent: 130 } },
 { id: '16', keyword: 'Online Gaming Communities', category: 'Sports', growth: '+55%', sentiment: 'positive', maturity: 'mature', description: 'The growth of online platforms for competitive and casual gaming.', metrics: { searchVolume: 40000, changePercent: 55 } },
 { id: '17', keyword: 'Craft Coffee Boom', category: 'Food', growth: '+45%', sentiment: 'neutral', maturity: 'mature', description: 'The rise of specialty coffee shops and home brewing.', metrics: { searchVolume: 23000, changePercent: 45 } },
 { id: '18', keyword: 'Space Tourism', category: 'Travel', growth: '+300%', sentiment: 'positive', maturity: 'emerging', description: 'Commercial ventures offering sub-orbital and orbital spaceflights.', metrics: { searchVolume: 7000, changePercent: 300 } },
 { id: '19', keyword: 'Digital Nomads', category: 'Travel', growth: '+80%', sentiment: 'positive', maturity: 'growing', description: 'Individuals who work remotely while traveling to different locations.', metrics: { searchVolume: 26000, changePercent: 80 } },
 { id: '20', keyword: 'Sustainable Fashion', category: 'Business', growth: '+95%', sentiment: 'positive', maturity: 'growing', description: 'The focus on environmentally friendly and ethical clothing production.', metrics: { searchVolume: 19000, changePercent: 95 } },
 { id: '21', keyword: 'Mental Wellness Apps', category: 'Technology', growth: '+115%', sentiment: 'positive', maturity: 'mature', description: 'Mobile applications providing tools for mental health and mindfulness.', metrics: { searchVolume: 35000, changePercent: 115 } },
 { id: '22', keyword: 'Indie Music Scene', category: 'Music', growth: '+35%', sentiment: 'positive', maturity: 'mature', description: 'The continued influence and growth of independent music artists.', metrics: { searchVolume: 28000, changePercent: 35 } },
 { id: '23', keyword: 'Biohacking', category: 'Science', growth: '+160%', sentiment: 'neutral', maturity: 'growing', description: 'Using science and technology to improve human performance and well-being.', metrics: { searchVolume: 14000, changePercent: 160 } },
 { id: '24', keyword: 'Pickleball Popularity', category: 'Sports', growth: '+250%', sentiment: 'positive', maturity: 'emerging', description: 'The rapid growth of pickleball as a recreational sport.', metrics: { searchVolume: 16000, changePercent: 250 } },
 { id: '25', keyword: 'E-commerce Personalization', category: 'Business', growth: '+70%', sentiment: 'positive', maturity: 'mature', description: 'Using data and AI to provide personalized shopping experiences.', metrics: { searchVolume: 32000, changePercent: 70 } },
 { id: '26', keyword: 'Virtual Reality in Education', category: 'Technology', growth: '+190%', sentiment: 'positive', maturity: 'growing', description: 'The use of VR for immersive learning experiences.', metrics: { searchVolume: 9500, changePercent: 190 } },
 { id: '27', keyword: 'Abstract Expressionism Revival', category: 'Art', growth: '+40%', sentiment: 'positive', maturity: 'early', description: 'Renewed interest in abstract expressionist art.', metrics: { searchVolume: 5000, changePercent: 40 } },
 { id: '28', keyword: 'Podcast Popularity', category: 'Music', growth: '+85%', sentiment: 'positive', maturity: 'mature', description: 'The continued growth of podcast listenership and creation.', metrics: { searchVolume: 60000, changePercent: 85 } },
  ]);

 // Added more diverse placeholder trends
 const [additionalPlaceholderTrends, setAdditionalPlaceholderTrends] = useState([
    { id: '29', keyword: 'Vinyl Record Sales Resurgence', category: 'Music', growth: '+40%', sentiment: 'positive', maturity: 'mature', description: 'The unexpected comeback of vinyl records among music enthusiasts.', metrics: { searchVolume: 15000, changePercent: 40 } },
    { id: '30', keyword: 'Street Art as Investment', category: 'Art', growth: '+70%', sentiment: 'positive', maturity: 'growing', description: 'Recognizing street art as a valuable asset in the art market.', metrics: { searchVolume: 7000, changePercent: 70 } },
    { id: '31', keyword: 'K-Pop Global Dominance', category: 'Music', growth: '+150%', sentiment: 'positive', maturity: 'mature', description: 'The increasing global influence and popularity of Korean pop music.', metrics: { searchVolume: 80000, changePercent: 150 } },
    { id: '32', keyword: 'NFT Music Market', category: 'Music', growth: '+110%', sentiment: 'neutral', maturity: 'early', description: 'Musicians exploring NFTs for distributing and monetizing their work.', metrics: { searchVolume: 6000, changePercent: 110 } },
    { id: '33', keyword: 'Interactive Art Installations', category: 'Art', growth: '+85%', sentiment: 'positive', maturity: 'growing', description: 'The rise of art experiences that engage the viewer directly.', metrics: { searchVolume: 9000, changePercent: 85 } },
    { id: '34', keyword: 'Sustainable and Ethical Fashion', category: 'Fashion', growth: '+95%', sentiment: 'positive', maturity: 'growing', description: 'Consumers demanding more environmentally and socially responsible clothing.', metrics: { searchVolume: 25000, changePercent: 95 } },
    { id: '35', keyword: 'Personalized Skincare Routines', category: 'Lifestyle', growth: '+70%', sentiment: 'positive', maturity: 'mature', description: 'The use of technology and data to create customized skincare plans.', metrics: { searchVolume: 30000, changePercent: 70 } },
    { id: '36', keyword: 'Mindfulness and Meditation Apps', category: 'Lifestyle', growth: '+60%', sentiment: 'positive', maturity: 'mature', description: 'The increasing adoption of apps for mental well-being and stress reduction.', metrics: { searchVolume: 40000, changePercent: 60 } },
    { id: '37', keyword: 'Gourmet Home Cooking Kits', category: 'Food', growth: '+55%', sentiment: 'positive', maturity: 'growing', description: 'Subscription services providing ingredients and recipes for restaurant-quality meals at home.', metrics: { searchVolume: 18000, changePercent: 55 } },
    { id: '38', keyword: 'Experiential Travel', category: 'Travel', growth: '+100%', sentiment: 'positive', maturity: 'growing', description: 'Travel focused on immersive cultural experiences rather than just sightseeing.', metrics: { searchVolume: 22000, changePercent: 100 } },
    { id: '39', keyword: 'Rise of E-bikes', category: 'Technology', growth: '+120%', sentiment: 'positive', maturity: 'mature', description: 'The increasing popularity of electric bikes for commuting and recreation.', metrics: { searchVolume: 35000, changePercent: 120 } },
    { id: '40', keyword: 'Local Craft Beer Scene', category: 'Food', growth: '+30%', sentiment: 'positive', maturity: 'mature', description: 'The continued growth and diversification of local craft breweries.', metrics: { searchVolume: 20000, changePercent: 30 } },
    { id: '41', keyword: 'Home Fitness Technology', category: 'Sports', growth: '+80%', sentiment: 'positive', maturity: 'mature', description: 'The integration of smart devices and online classes into home workouts.', metrics: { searchVolume: 50000, changePercent: 80 } },
    { id: '42', keyword: 'Sustainable Architecture', category: 'Business', growth: '+90%', sentiment: 'positive', maturity: 'growing', description: 'Building design and construction focused on environmental responsibility.', metrics: { searchVolume: 15000, changePercent: 90 } },
    { id: '43', keyword: 'AI in Music Creation', category: 'Music', growth: '+180%', sentiment: 'neutral', maturity: 'emerging', description: 'Using artificial intelligence to compose and produce music.', metrics: { searchVolume: 8000, changePercent: 180 } },
 ]);

 // Combine initial and additional placeholder trends
 const allPlaceholderTrends = [...placeholderTrends, ...additionalPlaceholderTrends];


  // Use placeholder data if firebase data is not loaded or empty
  const displayedTrends = trends.length > 0 ? trends : placeholderTrends;

  const filteredTrends = displayedTrends.filter(trend => {
 console.log('Filtering:', { selectedCategory, trend }); // Log category and trend being filtered
    if (!trend || !trend.keyword) return false;

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = trend.keyword.toLowerCase().includes(searchLower) ||
                          (trend.category && trend.category.toLowerCase().includes(searchLower));


    if (!appliedFilters) return matchesSearch;

    const matchesCategory = selectedCategory === 'All' || (trend.category && trend.category.toLowerCase() === selectedCategory.toLowerCase());

    // const matchesCategory = appliedFilters.categories.length === 0 || appliedFilters.categories.includes(trend.category);

    const matchesMaturity = !appliedFilters.maturity || appliedFilters.maturity === trend.maturity;
    const matchesSentiment = !appliedFilters.sentiment || appliedFilters.sentiment.toLowerCase() === trend.sentiment;
    const matchesVolume = !appliedFilters.minVolume || trend.metrics.searchVolume >= appliedFilters.minVolume;
    
    // Note: Time period filtering is not implemented as the data is static.

    return matchesSearch && matchesCategory && matchesMaturity && matchesSentiment && matchesVolume;
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <div className={`flex-1 p-6 transition-all duration-300 ease-in-out`} style={{ marginLeft: isSidebarCollapsed ? '80px' : '256px' }}>
            <div className="flex items-center justify-center h-full">
              <div className="text-white text-xl">Loading dashboard...</div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className={`flex-1 p-6 transition-all duration-300 ease-in-out`} style={{ marginLeft: isSidebarCollapsed ? '80px' : '256px' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search trends..."
                  className="w-full max-w-lg pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
                  <Bell className="w-6 h-6 text-gray-400" />
                  <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-gray-800"></span>
                </Button>
                <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Trend Dashboard</h1>
                <p className="text-gray-400">Discover and analyze emerging trends in real-time</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <Link to="/alerts">
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Alerts
                  </Button>
                </Link>
                <Link to="/saved">
                  <Button variant="outline" size="sm">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Saved
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          <Analytics />

          {/* Today's Special Highlight */}
          {todaysHighlight && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6 mb-8"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 font-semibold">Today's Special Highlight</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{todaysHighlight.title}</h3>
                  <p className="text-gray-300 mb-4">{todaysHighlight.description}</p>
                  <div className="flex items-center space-x-6">
                    <div className="text-sm">
                      <span className="text-gray-400">Growth: </span>
                      <span className="text-green-400 font-semibold">{todaysHighlight.growth}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Impact: </span>
                      <span className="text-orange-400 font-semibold">{todaysHighlight.impact}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Timeline: </span>
                      <span className="text-blue-400 font-semibold">{todaysHighlight.timeline}</span>
                    </div>
                  </div>
                </div>
                <Button variant="solid" size="sm" onClick={() => navigate(`/trend/${todaysHighlight.id}`)}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Explore
                </Button>
              </div>
            </motion.div>
          )}

          <div className="flex flex-wrap gap-4 mb-6">
              <Button variant={showAudience ? 'solid' : 'outline'} size="sm" onClick={() => setShowAudience(!showAudience)}>
                  Audience Demographics
              </Button>
              <Button variant={showInfluencers ? 'solid' : 'outline'} size="sm" onClick={() => setShowInfluencers(!showInfluencers)}>
                  Influencer Identification
              </Button>
              <Button variant={showCommunity ? 'solid' : 'outline'} size="sm" onClick={() => setShowCommunity(!showCommunity)}>
                  Community Detection
              </Button>
          </div>

          {showAudience && <AudienceDemographics />}
          {showInfluencers && <InfluencerIdentification />}
          {showCommunity && <CommunityDetection />}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Trends Feed */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-white mb-6">Trending Now</h2>
                <div className="flex flex-wrap gap-4 mb-6">
                    <Button variant={selectedCategory === 'All' ? 'solid' : 'outline'} size="sm" onClick={() => setSelectedCategory('All')}>
                        All
                    </Button>
                    <Button variant={selectedCategory === 'Technology' ? 'solid' : 'outline'} size="sm" onClick={() => setSelectedCategory('Technology')}>
                        Technology
                    </Button>
                    <Button variant={selectedCategory === 'Art' ? 'solid' : 'outline'} size="sm" onClick={() => setSelectedCategory('Art')}>
                        Art
                    </Button>
 <Button variant={selectedCategory === 'Music' ? 'solid' : 'outline'} size="sm" onClick={() => setSelectedCategory('Music')}>
                        Music
                    </Button>
                    <Button variant={selectedCategory === 'Science' ? 'solid' : 'outline'} size="sm" onClick={() => setSelectedCategory('Science')}>
                        Science
                    </Button>
                    <Button variant={selectedCategory === 'Sports' ? 'solid' : 'outline'} size="sm" onClick={() => setSelectedCategory('Sports')}>
                        Sports
                    </Button>
                    <Button variant={selectedCategory === 'Business' ? 'solid' : 'outline'} size="sm" onClick={() => setSelectedCategory('Business')}>
                        Business
                    </Button>                </div>
                <div className="space-y-6">
                {filteredTrends.map((trend, index) => (
                  <motion.div
                    key={trend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => navigate(`/trend/${trend.id}`)}
                  >
                    <TrendCard trend={trend} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-8">
                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
                    <Button variant="outline" className="w-full" onClick={() => setIsFilterModalOpen(true)}>
                        <Filter className="w-4 h-4 mr-2" />
                        Advanced Filters
                    </Button>
                </div>
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Keywords (24h)</h3>
                <div className="space-y-3">
                  {topKeywords.map((item, index) => (
                    <KeywordCard 
                        key={item.id}
                        index={index}
                        keyword={item.keyword}
                        volume={item.volume}
                        growth={item.growth}
                    />
                  ))}\
                </div>
              </div>
            </div>
          </div>
        </div>
        <FilterModal 
            isOpen={isFilterModalOpen} 
            onClose={() => setIsFilterModalOpen(false)} 
            onApplyFilters={setAppliedFilters} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
