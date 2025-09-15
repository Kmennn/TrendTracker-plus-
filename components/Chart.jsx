import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg border border-purple-500/50">
        <p className="font-bold text-base">{`${label}`}</p>
        <p className="text-sm text-purple-300">{`Value: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const Chart = ({ data }) => {
  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.values[index],
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
        <defs>
          <linearGradient id="themeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7}/>
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          tick={{ fill: '#a3a3a3', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: '#a3a3a3', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
        />
        <Bar dataKey="value" fill="url(#themeGradient)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
