/**
 * SocialMoversList - Migrated to TanStack Query
 * Uses useSocialMovers hook with automatic caching
 */

import React from 'react';
import { useSocialMovers } from '../hooks/useStocks';
import { ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import './SocialMoversList.css';

const SocialMoversList = () => {
  const { data: movers = [], isLoading, error } = useSocialMovers();

  if (isLoading) {
    return (
      <div className="social-movers-list loading">
        <Loader2 className="animate-spin inline mr-2" /> Loading Social Movers...
      </div>
    );
  }

  if (error || movers.length === 0) {
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
