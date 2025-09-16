import React from 'react';
import './StockCard.css';

const StockCard = ({ symbol, data }) => {
  if (!data) {
    return <div className="stock-card loading">Loading {symbol}...</div>;
  }

  const isPositive = data.change && parseFloat(data.change) >= 0;

  return (
    <div className={`stock-card ${isPositive ? 'positive' : 'negative'}`}>
      <h3 className="symbol">{symbol}</h3>
      <p className="price">${parseFloat(data.price).toFixed(2)}</p>
      <div className="change-info">
        <span className="change">{parseFloat(data.change).toFixed(2)}</span>
        <span className="percent-change">({parseFloat(data.percentChange).toFixed(2)}%)</span>
      </div>
    </div>
  );
};

export default StockCard;
