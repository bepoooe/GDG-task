import React from 'react';
import { Brain, Code, Users, AlertTriangle, RefreshCw, Lightbulb, Sparkles } from 'lucide-react';
import './AIInsights.css';

const AIInsights = ({ insights, loading, error, onRetry }) => {
  const isRateLimit = error && (
    error.includes('rate limit') || 
    error.includes('quota') || 
    error.includes('429')
  );

  if (error) {
    return (
      <div className="ai-insights">
        <h3>AI-Generated Insights</h3>
        <div className="error-message">
          <AlertTriangle size={20} />
          <div>
            <div>Failed to generate AI insights: {error}</div>
            {isRateLimit && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                <Lightbulb size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Tip: The free Gemini API has limited requests per minute. 
                Wait a moment and try again, or consider upgrading your API plan.
              </div>
            )}
            {onRetry && (
              <button 
                onClick={onRetry}
                style={{
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--accent-gradient)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'var(--transition)',
                  boxShadow: 'var(--shadow-md)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                <RefreshCw size={16} />
                Retry AI Analysis
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="ai-insights">
        <h3>AI-Generated Insights</h3>
        <div className="insights-grid">
          <div className="insight-card loading">
            <div className="insight-header">
              <Brain className="insight-icon" />
              <h4>Repository Summary</h4>
            </div>
            <div className="loading-skeleton"></div>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>
              Analyzing repository purpose and features...
            </p>
          </div>
          
          <div className="insight-card loading">
            <div className="insight-header">
              <Code className="insight-icon" />
              <h4>Language Analysis</h4>
            </div>
            <div className="loading-skeleton"></div>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>
              Evaluating technology stack...
            </p>
          </div>
          
          <div className="insight-card loading">
            <div className="insight-header">
              <Users className="insight-icon" />
              <h4>Contribution Patterns</h4>
            </div>
            <div className="loading-skeleton"></div>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>
              Examining collaboration patterns...
            </p>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '1rem', opacity: 0.8, fontSize: '0.9rem' }}>
          <Sparkles size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
          Generating insights sequentially to respect API rate limits...
        </p>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  return (
    <div className="ai-insights">
      <h3>AI-Generated Insights</h3>
      <p className="insights-subtitle">
        Powered by Google Gemini AI - Deep analysis of repository patterns and characteristics
      </p>
      
      <div className="insights-grid">
        {insights.repositorySummary && (
          <div className="insight-card">
            <div className="insight-header">
              <Brain className="insight-icon" />
              <h4>Repository Summary</h4>
            </div>
            <p className="insight-content">{insights.repositorySummary}</p>
          </div>
        )}
        
        {insights.languageAnalysis && (
          <div className="insight-card">
            <div className="insight-header">
              <Code className="insight-icon" />
              <h4>Technology Stack Analysis</h4>
            </div>
            <p className="insight-content">{insights.languageAnalysis}</p>
          </div>
        )}
        
        {insights.contributionAnalysis && (
          <div className="insight-card">
            <div className="insight-header">
              <Users className="insight-icon" />
              <h4>Collaboration Patterns</h4>
            </div>
            <p className="insight-content">{insights.contributionAnalysis}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
