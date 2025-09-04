import React, { useState } from 'react';
import { Search, BarChart, Brain, Zap } from 'lucide-react';
import './SearchForm.css';

const SearchForm = ({ 
  onSearch, 
  loading, 
  isComparisonMode = false,
  placeholder1 = "Repository Owner",
  placeholder2 = "Repository Name",
  buttonText = "Analyze Repository",
  compact = false
}) => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (owner.trim() && repo.trim()) {
      onSearch(owner.trim(), repo.trim());
    }
  };

  return (
    <div className={`search-form ${compact ? 'search-form-compact' : ''}`}>
      {!compact && (
        <>
          <div className="hero-subtitle">Discover & Analyze</div>
          <h1>GitHub Repository Insights</h1>
          <p>
            {isComparisonMode 
              ? "Compare two GitHub repositories side by side to see detailed insights and metrics"
              : "Enter a GitHub repository to get detailed insights and AI-powered analysis"
            }
          </p>
          <div className="hero-features">
            <div className="feature-item">
              <BarChart className="feature-icon" size={20} />
              <span>Detailed Analytics</span>
            </div>
            <div className="feature-item">
              <Brain className="feature-icon" size={20} />
              <span>AI Insights</span>
            </div>
            <div className="feature-item">
              <Zap className="feature-icon" size={20} />
              <span>Real-time Data</span>
            </div>
          </div>
        </>
      )}
      
      <form onSubmit={handleSubmit} className="search-container">
        <div className="input-group">
          <input
            type="text"
            placeholder={placeholder1}
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            disabled={loading}
            required
          />
          <span className="separator">/</span>
          <input
            type="text"
            placeholder={placeholder2}
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        
        <button type="submit" disabled={loading} className="search-button">
          <Search size={20} />
          {loading ? 'Analyzing...' : buttonText}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
