import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUp, ArrowDown } from 'lucide-react';
import './SocialMoversList.css';

const SocialMoversList = () => {
  const [movers, setMovers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/social-movers');
        setMovers(response.data);
      } catch (error) {
        console.error('Failed to fetch social movers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovers();
  }, []);

  if (loading) {
    return <div className="social-movers-list loading">Loading Social Movers...</div>;
  }

  if (movers.length === 0) {
    return null; // Don't render the component if there's no data
  }

  return (
    <div className="social-movers-list">
      <h3 className="list-title">Top Social Movers</h3>
      <div className="list-container">
        {movers.map((mover, index) => {
          const isPositive = mover.socialMomentumScore >= 0;
          return (
            <div key={mover.symbol} className="mover-item">
              <div className="rank">#{index + 1}</div>
              <div className="symbol">{mover.symbol}</div>
              <div className={`momentum-score ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {mover.socialMomentumScore}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialMoversList;
