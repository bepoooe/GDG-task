import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './LanguageChart.css';

const LanguageChart = ({ languages }) => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  if (!languages || Object.keys(languages).length === 0) {
    return (
      <div className="language-chart">
        <h3>Language Composition</h3>
        <p className="no-data">No language data available</p>
      </div>
    );
  }

  // Calculate total bytes and convert to percentage
  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  
  const chartData = Object.entries(languages)
    .map(([language, bytes]) => ({
      name: language,
      value: bytes,
      percentage: ((bytes / totalBytes) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value);

  // Theme-appropriate color palette
  const COLORS = [
    '#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F4A460',
    '#D2B48C', '#BC8F8F', '#A0522D', '#B8860B', '#DAA520',
    '#B22222', '#CD5C5C', '#F5DEB3', '#FFEFD5', '#E6E6FA'
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{data.name}</p>
          <p className="tooltip-value">{data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    if (parseFloat(percentage) < 5) return null; // Don't show labels for small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Determine font size based on current window width
    const isMobile = windowWidth <= 768;
    const fontSize = isMobile ? "10" : "12";

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight="bold"
      >
        {`${percentage}%`}
      </text>
    );
  };

  // Calculate responsive radius based on current window width
  const getOuterRadius = () => {
    if (windowWidth <= 480) return 70;  // Small mobile
    if (windowWidth <= 768) return 90;  // Tablet/large mobile
    return 120; // Desktop
  };

  return (
    <div className="language-chart">
      <h3>Language Composition</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={getOuterRadius()}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => `${value} (${entry.payload.percentage}%)`}
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="language-stats">
        {chartData.slice(0, 5).map((lang, index) => (
          <div key={lang.name} className="language-stat">
            <div 
              className="language-color" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="language-name">{lang.name}</span>
            <span className="language-percentage">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageChart;
