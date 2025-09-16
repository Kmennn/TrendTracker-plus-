import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './CorrelatedChart.css';

const CorrelatedChart = ({ symbol }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/correlated-data/${symbol}`);
        setData(response.data);
      } catch (error) {
        console.error(`Failed to fetch correlated data for ${symbol}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) {
    return <div className="chart-loading">Loading Correlated View...</div>;
  }

  if (data.length === 0) {
    return <div className="chart-error">Could not load correlated data. The stock symbol may not be tracked or an API error occurred.</div>;
  }

  return (
    <div className="correlated-chart-container">
      <h3 className="chart-title">Correlated View: Stock Price vs. Social Volume</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" />
          <YAxis yAxisId="left" label={{ value: 'Stock Price (USD)', angle: -90, position: 'insideLeft', fill: '#8884d8' }} stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Social Volume', angle: -90, position: 'insideRight', fill: '#82ca9d' }} stroke="#82ca9d" />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4B5563' }} 
            labelStyle={{ color: '#E5E7EB' }}
          />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="price" name="Stock Price" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="social_volume" name="Social Volume" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CorrelatedChart;
