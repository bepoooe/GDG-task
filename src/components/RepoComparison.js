import React from 'react';
import { GitCompare, Star, GitFork, Eye, Calendar, Users, Activity } from 'lucide-react';
import './RepoComparison.css';

const RepoComparison = ({ repo1Data, repo2Data }) => {
  if (!repo1Data || !repo2Data) {
    return null;
  }

  const compareMetric = (value1, value2) => {
    if (value1 > value2) return { winner: 'repo1', diff: value1 - value2 };
    if (value2 > value1) return { winner: 'repo2', diff: value2 - value1 };
    return { winner: 'tie', diff: 0 };
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const metrics = [
    {
      name: 'Stars',
      icon: Star,
      repo1: repo1Data.stargazers_count,
      repo2: repo2Data.stargazers_count,
      comparison: compareMetric(repo1Data.stargazers_count, repo2Data.stargazers_count)
    },
    {
      name: 'Forks',
      icon: GitFork,
      repo1: repo1Data.forks_count,
      repo2: repo2Data.forks_count,
      comparison: compareMetric(repo1Data.forks_count, repo2Data.forks_count)
    },
    {
      name: 'Watchers',
      icon: Eye,
      repo1: repo1Data.watchers_count,
      repo2: repo2Data.watchers_count,
      comparison: compareMetric(repo1Data.watchers_count, repo2Data.watchers_count)
    },
    {
      name: 'Open Issues',
      icon: Activity,
      repo1: repo1Data.open_issues_count,
      repo2: repo2Data.open_issues_count,
      comparison: compareMetric(repo2Data.open_issues_count, repo1Data.open_issues_count) // Lower is better
    }
  ];

  return (
    <div className="comparison-results">
      <h3>
        <GitCompare size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />
        Repository Comparison
      </h3>
      
      <div className="comparison-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div 
              key={metric.name} 
              className={`comparison-card ${metric.comparison.winner !== 'tie' ? 'has-winner' : ''}`}
            >
              <h4>
                <Icon size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
                {metric.name}
              </h4>
              <div className="comparison-stats">
                <div className={`comparison-stat ${metric.comparison.winner === 'repo1' ? 'comparison-winner' : ''}`}>
                  <div className="label">{repo1Data.name}</div>
                  <div className="value">{formatNumber(metric.repo1)}</div>
                </div>
                <div className={`comparison-stat ${metric.comparison.winner === 'repo2' ? 'comparison-winner' : ''}`}>
                  <div className="label">{repo2Data.name}</div>
                  <div className="value">{formatNumber(metric.repo2)}</div>
                </div>
              </div>
              {metric.comparison.winner !== 'tie' && (
                <div className="comparison-diff">
                  <small>
                    {metric.comparison.winner === 'repo1' ? repo1Data.name : repo2Data.name} leads by {formatNumber(metric.comparison.diff)}
                  </small>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="comparison-grid">
        <div className="comparison-card">
          <h4>
            <Calendar size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Repository Age
          </h4>
          <div className="comparison-stats">
            <div className="comparison-stat">
              <div className="label">{repo1Data.name}</div>
              <div className="value">{formatDate(repo1Data.created_at)}</div>
            </div>
            <div className="comparison-stat">
              <div className="label">{repo2Data.name}</div>
              <div className="value">{formatDate(repo2Data.created_at)}</div>
            </div>
          </div>
        </div>

        <div className="comparison-card">
          <h4>
            <Activity size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Last Updated
          </h4>
          <div className="comparison-stats">
            <div className="comparison-stat">
              <div className="label">{repo1Data.name}</div>
              <div className="value">{formatDate(repo1Data.updated_at)}</div>
            </div>
            <div className="comparison-stat">
              <div className="label">{repo2Data.name}</div>
              <div className="value">{formatDate(repo2Data.updated_at)}</div>
            </div>
          </div>
        </div>

        <div className="comparison-card">
          <h4>Repository Size</h4>
          <div className="comparison-stats">
            <div className="comparison-stat">
              <div className="label">{repo1Data.name}</div>
              <div className="value">{formatNumber(repo1Data.size)} KB</div>
            </div>
            <div className="comparison-stat">
              <div className="label">{repo2Data.name}</div>
              <div className="value">{formatNumber(repo2Data.size)} KB</div>
            </div>
          </div>
        </div>

        <div className="comparison-card">
          <h4>Default Branch</h4>
          <div className="comparison-stats">
            <div className="comparison-stat">
              <div className="label">{repo1Data.name}</div>
              <div className="value">{repo1Data.default_branch}</div>
            </div>
            <div className="comparison-stat">
              <div className="label">{repo2Data.name}</div>
              <div className="value">{repo2Data.default_branch}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="comparison-summary">
        <div className="comparison-card">
          <h4>Summary</h4>
          <div className="summary-content">
            <p><strong>{repo1Data.name}</strong>: {repo1Data.description || 'No description available'}</p>
            <p><strong>{repo2Data.name}</strong>: {repo2Data.description || 'No description available'}</p>
            
            <div style={{ marginTop: '1rem' }}>
              <h5>Languages</h5>
              <div className="language-comparison">
                <div>
                  <strong>{repo1Data.name}:</strong> {repo1Data.language || 'Not specified'}
                </div>
                <div>
                  <strong>{repo2Data.name}:</strong> {repo2Data.language || 'Not specified'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoComparison;
