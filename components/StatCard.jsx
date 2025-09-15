import React from 'react';

const StatCard = ({ icon, label }) => {
  return (
    <div className="flex items-center bg-gray-900/50 p-3 rounded-lg">
      <div className="mr-3 text-blue-400">{icon}</div>
      <span className="text-white">{label}</span>
    </div>
  );
};

export default StatCard;
