import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockCard from '../components/StockCard';
import SocialMoversList from '../components/SocialMoversList'; // Import the new component
import './MarketsPage.css';

const MarketsPage = () => {
  const [stockData, setStockData] = useState({});
  const symbols = ['IBM', 'TSCO.LON', 'RELIANCE.BSE']; // Same symbols as in the backend

  useEffect(() => {
    const fetchStockData = async () => {
      const data = {};
      for (const symbol of symbols) {
        try {
          const response = await axios.get(`/api/stocks/${symbol}`);
          data[symbol] = response.data;
        } catch (error) {
          console.error(`Failed to fetch data for ${symbol}:`, error);
          data[symbol] = null; // To indicate that data fetching failed
        }
      }
      setStockData(data);
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []); // Removed symbols from dependency array as it's constant

  return (
    <div className="markets-page">
      <h1 className="page-title">Markets</h1>
      
      {/* --- NEW: Social Movers List --- */}
      <SocialMoversList />

      <h2 className="section-title">All Stocks</h2>
      <div className="stock-grid">
        {symbols.map(symbol => (
          <StockCard key={symbol} symbol={symbol} data={stockData[symbol]} />
        ))
      }
      </div>
    </div>
  );
};

export default MarketsPage;
