import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import './TrendsChart.css';

const TrendsChart = ({ repoData, commitActivity }) => {
  if (!repoData) {
    return (
      <div className="trends-chart">
        <h3>Repository Trends</h3>
        <p className="no-data">No data available</p>
      </div>
    );
  }

  // Create trend data based on repository metrics
  const trendData = [
    {
      metric: 'Stars',
      value: repoData.stargazers_count,
      color: '#DAA520',
      icon: '⭐'
    },
    {
      metric: 'Forks',
      value: repoData.forks_count,
      color: '#CD853F',
      icon: '🍴'
    },
    {
      metric: 'Issues',
      value: repoData.open_issues_count,
      color: '#D2691E',
      icon: '🔍'
    },
    {
      metric: 'Watchers',
      value: repoData.watchers_count,
      color: '#B8860B',
      icon: '👀'
    }
  ];

  // Create growth simulation data
  const growthData = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    
    // Simulate growth patterns based on current metrics
    const growthFactor = Math.random() * 0.3 + 0.85; // 85%-115% variation
    const starsGrowth = Math.floor(repoData.stargazers_count * growthFactor * (1 - i * 0.08));
    const forksGrowth = Math.floor(repoData.forks_count * growthFactor * (1 - i * 0.06));
    
    growthData.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      stars: Math.max(starsGrowth, 0),
      forks: Math.max(forksGrowth, 0),
      fullDate: date.toLocaleDateString()
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-value" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const MetricTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{data.icon} {data.metric}</p>
          <p className="tooltip-value">{data.value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="trends-chart">
      <h3>Repository Insights</h3>
      
      <div className="metrics-overview">
        <div className="metrics-bars">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e4e8" />
              <XAxis 
                dataKey="metric" 
                stroke="#8B4513"
                fontSize={12}
              />
              <YAxis 
                stroke="#8B4513"
                fontSize={12}
                allowDecimals={false}
              />
              <Tooltip content={<MetricTooltip />} />
              <Bar 
                dataKey="value" 
                fill="#8B4513"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="growth-trends">
        <h4>Growth Simulation (Last 12 Months)</h4>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="starsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DAA520" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#DAA520" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="forksGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#CD853F" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#CD853F" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              stroke="#8B4513"
              fontSize={11}
            />
            <YAxis 
              stroke="#8B4513"
              fontSize={11}
              allowDecimals={false}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#e1e4e8" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="stars"
              stackId="1"
              stroke="#DAA520"
              fill="url(#starsGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="forks"
              stackId="2"
              stroke="#CD853F"
              fill="url(#forksGradient)"
              strokeWidth={2}
            />
            <Legend />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="repo-health">
        <h4>Repository Health Indicators</h4>
        <div className="health-metrics">
          <div className="health-item">
            <div className="health-icon">📈</div>
            <div className="health-info">
              <span className="health-label">Activity Level</span>
              <span className="health-value">
                {commitActivity && commitActivity.length > 0 ? 'Active' : 'Moderate'}
              </span>
            </div>
          </div>
          <div className="health-item">
            <div className="health-icon">🏷️</div>
            <div className="health-info">
              <span className="health-label">Latest Release</span>
              <span className="health-value">
                {new Date(repoData.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="health-item">
            <div className="health-icon">👥</div>
            <div className="health-info">
              <span className="health-label">Community Size</span>
              <span className="health-value">
                {(repoData.stargazers_count + repoData.forks_count).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="health-item">
            <div className="health-icon">🔧</div>
            <div className="health-info">
              <span className="health-label">Maintenance</span>
              <span className="health-value">
                {repoData.has_issues ? 'Active' : 'Limited'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsChart;
