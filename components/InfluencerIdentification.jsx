import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const influencers = [
    { id: 1, username: '@CryptoKing', followers: '1.2M', engagement: '8.5%', recentPost: 'Bitcoin to the moon! #BTC' },
    { id: 2, username: '@TechGuru', followers: '850K', engagement: '6.2%', recentPost: 'New AI trend is taking over the world.' },
    { id: 3, username: '@Fashionista', followers: '2.5M', engagement: '12.1%', recentPost: 'Loving the new collection from @Brand.' },
    { id: 4, username: '@Foodie', followers: '500K', engagement: '9.8%', recentPost: 'This new recipe is a must-try!' },
    { id: 5, username: '@Gamer', followers: '3.1M', engagement: '15.3%', recentPost: 'Just reached the final level of the new game.' },
    { id: 6, username: '@TravelBug', followers: '1.8M', engagement: '11.2%', recentPost: 'Exploring the beautiful beaches of Bali.' },
    { id: 7, username: '@NewsNetwork', followers: '5.2M', engagement: '4.1%', recentPost: 'Breaking news: Major event unfolds.' },
    { id: 8, username: '@BrandOfficial', followers: '10.5M', engagement: '2.5%', recentPost: 'Our new product is now available!' },
];

const SortableHeader = ({ children, sortKey, sortConfig, onSort }) => {
  const isSorted = sortConfig && sortConfig.key === sortKey;
  const isAsc = isSorted && sortConfig.direction === 'ascending';
  const isDesc = isSorted && sortConfig.direction === 'descending';

  return (
    <th 
      className="p-4 text-left cursor-pointer transition-colors hover:bg-gray-700/50"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center">
        {children}
        <span className="ml-2">
          {isAsc && <FaSortUp />}
          {isDesc && <FaSortDown />}
          {!isSorted && <FaSort className="text-gray-500" />}
        </span>
      </div>
    </th>
  );
};

const InfluencerIdentification = () => {
  const [sortConfig, setSortConfig] = useState(null);

  const sortedInfluencers = useMemo(() => {
    let sortableItems = [...influencers];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        // Convert followers to a number for sorting
        const aVal = sortConfig.key === 'followers' ? parseFloat(a[sortConfig.key]) * (a[sortConfig.key].toUpperCase().includes('M') ? 1000000 : 1000) : a[sortConfig.key];
        const bVal = sortConfig.key === 'followers' ? parseFloat(b[sortConfig.key]) * (b[sortConfig.key].toUpperCase().includes('M') ? 1000000 : 1000) : b[sortConfig.key];

        if (aVal < bVal) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [influencers, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-800/50 rounded-xl p-8 mb-8 border border-gray-700/50"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white mb-6">
        Influencer Identification
      </motion.h2>
      <motion.p variants={itemVariants} className="text-gray-400 mb-8">
        Top accounts driving the conversation, ranked by influence.
      </motion.p>
      <motion.div variants={itemVariants} className="overflow-x-auto">
        <table className="min-w-full text-white rounded-lg overflow-hidden">
          <thead className="bg-gray-900/50">
            <tr>
              <SortableHeader sortKey="username" sortConfig={sortConfig} onSort={requestSort}>Username</SortableHeader>
              <SortableHeader sortKey="followers" sortConfig={sortConfig} onSort={requestSort}>Followers</SortableHeader>
              <SortableHeader sortKey="engagement" sortConfig={sortConfig} onSort={requestSort}>Engagement</SortableHeader>
              <th className="p-4 text-left">Recent Post on Topic</th>
            </tr>
          </thead>
          <motion.tbody variants={containerVariants}>
            {sortedInfluencers.map((influencer, index) => (
              <motion.tr 
                key={influencer.id} 
                variants={itemVariants}
                className={`${index % 2 === 0 ? 'bg-gray-800/60' : 'bg-gray-800/40'} hover:bg-gray-700/50 transition-colors`}
              >
                <td className="p-4">{influencer.username}</td>
                <td className="p-4">{influencer.followers}</td>
                <td className="p-4">{influencer.engagement}</td>
                <td className="p-4 text-gray-300">{influencer.recentPost}</td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default InfluencerIdentification;
