/**
 * MarketsPage - Migrated to TanStack Query
 * Uses useStocks hook with automatic caching and 60s refresh
 */

import React from 'react';
import { useStocks } from '../hooks/useStocks';
import StockCard from '../components/StockCard';
import SocialMoversList from '../components/SocialMoversList';
import { Loader2 } from 'lucide-react';
import './MarketsPage.css';

const MarketsPage = () => {
  const { data: stockData = {}, isLoading, error } = useStocks();
  const symbols = ['IBM', 'TSCO.LON', 'RELIANCE.BSE'];

  return (
    <div className="markets-page">
      <h1 className="page-title">Markets</h1>
      
      {/* Social Movers Section */}
      <SocialMoversList />

      <h2 className="section-title">All Stocks</h2>
      
      {isLoading ? (
        <div className="flex items-center justify-center p-8 text-gray-400">
          <Loader2 className="animate-spin mr-2" /> Loading market data...
        </div>
      ) : error ? (
        <div className="text-red-400 p-4">Failed to load market data. Please try again.</div>
      ) : (
        <div className="stock-grid">
          {symbols.map(symbol => (
            <StockCard key={symbol} symbol={symbol} data={stockData[symbol]} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketsPage;
