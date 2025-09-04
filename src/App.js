import React, { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import StatsCard from './components/StatsCard';
import LanguageChart from './components/LanguageChart';
import CommitChart from './components/CommitChart';
import TrendsChart from './components/TrendsChart';
import AIInsights from './components/AIInsights';
import RepoComparison from './components/RepoComparison';
import githubService from './services/githubService';
import aiService from './services/aiService';
import { GitCompare, BarChart3 } from 'lucide-react';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [repoData, setRepoData] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [commitActivity, setCommitActivity] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [contributorsData, setContributorsData] = useState(null);
  
  // Comparison mode state
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [repo1Data, setRepo1Data] = useState(null);
  const [repo2Data, setRepo2Data] = useState(null);
  const [repo1Languages, setRepo1Languages] = useState(null);
  const [repo2Languages, setRepo2Languages] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState({ repo1: false, repo2: false });

  const generateAIInsights = async (repoInfo, languagesData, contributorsData) => {
    setAiLoading(true);
    setAiError(null);
    
    try {
      const readmeContent = await githubService.getReadme(repoInfo.owner.login, repoInfo.name);
      const insights = {};
      
      // Generate insights sequentially to avoid hitting rate limits
      try {
        console.log('Generating repository summary...');
        insights.repositorySummary = await aiService.generateRepositorySummary(repoInfo, readmeContent);
        console.log('Repository summary generated successfully');
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        console.warn('Failed to generate repository summary:', err.message);
      }

      if (languagesData && Object.keys(languagesData).length > 0) {
        try {
          console.log('Generating language analysis...');
          insights.languageAnalysis = await aiService.generateLanguageAnalysis(languagesData, repoInfo);
          console.log('Language analysis generated successfully');
          
          // Small delay between requests
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (err) {
          console.warn('Failed to generate language analysis:', err.message);
        }
      }

      if (contributorsData && contributorsData.length > 0) {
        try {
          console.log('Generating contribution analysis...');
          insights.contributionAnalysis = await aiService.generateContributionAnalysis(contributorsData, repoInfo);
          console.log('Contribution analysis generated successfully');
        } catch (err) {
          console.warn('Failed to generate contribution analysis:', err.message);
        }
      }

      setAiInsights(insights);
    } catch (aiErr) {
      setAiError(aiErr.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleRetryAI = () => {
    if (repoData) {
      generateAIInsights(repoData, languages, contributorsData);
    }
  };

  const handleSearch = async (owner, repo, targetRepo = 'single') => {
    if (!isComparisonMode) {
      // Single repository mode
      setLoading(true);
      setError(null);
      setAiError(null);
      setRepoData(null);
      setLanguages(null);
      setCommitActivity(null);
      setAiInsights(null);

      try {
        // Fetch basic repository data
        const repoInfo = await githubService.getRepository(owner, repo);
        setRepoData(repoInfo);

        // Fetch additional data in parallel
        const [languagesData, commitActivityData, contributorsData] = await Promise.allSettled([
          githubService.getLanguages(owner, repo),
          githubService.getCommitActivity(owner, repo),
          githubService.getContributors(owner, repo)
        ]);

        if (languagesData.status === 'fulfilled') {
          setLanguages(languagesData.value);
        }

        if (commitActivityData.status === 'fulfilled') {
          console.log('Commit activity data:', commitActivityData.value);
          setCommitActivity(commitActivityData.value);
        } else {
          console.warn('Failed to fetch commit activity:', commitActivityData.reason);
        }

        if (contributorsData.status === 'fulfilled') {
          setContributorsData(contributorsData.value);
        } else {
          console.warn('Failed to fetch contributors:', contributorsData.reason);
        }

        // Generate AI insights
        generateAIInsights(
          repoInfo, 
          languagesData.status === 'fulfilled' ? languagesData.value : null,
          contributorsData.status === 'fulfilled' ? contributorsData.value : null
        );

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Comparison mode
      const isRepo1 = targetRepo === 'repo1';
      setComparisonLoading(prev => ({ ...prev, [targetRepo]: true }));
      setError(null);

      try {
        const repoInfo = await githubService.getRepository(owner, repo);
        const languagesData = await githubService.getLanguages(owner, repo);

        if (isRepo1) {
          setRepo1Data(repoInfo);
          setRepo1Languages(languagesData);
        } else {
          setRepo2Data(repoInfo);
          setRepo2Languages(languagesData);
        }
      } catch (err) {
        setError(`Error fetching ${targetRepo}: ${err.message}`);
      } finally {
        setComparisonLoading(prev => ({ ...prev, [targetRepo]: false }));
      }
    }
  };

  const toggleComparisonMode = () => {
    setIsComparisonMode(!isComparisonMode);
    // Clear all data when switching modes
    setRepoData(null);
    setLanguages(null);
    setCommitActivity(null);
    setAiInsights(null);
    setRepo1Data(null);
    setRepo2Data(null);
    setRepo1Languages(null);
    setRepo2Languages(null);
    setError(null);
    setAiError(null);
  };

  return (
    <div className="App">
      <Header />
      <div className="container">
        <SearchForm 
          onSearch={handleSearch} 
          loading={loading || comparisonLoading.repo1 || comparisonLoading.repo2}
          isComparisonMode={isComparisonMode}
        />
        
        <div className="comparison-mode-toggle">
          <button 
            className={`toggle-button ${isComparisonMode ? 'active' : ''}`}
            onClick={toggleComparisonMode}
          >
            {isComparisonMode ? <BarChart3 size={20} /> : <GitCompare size={20} />}
            {isComparisonMode ? 'Single Repository Mode' : 'Compare Repositories'}
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}

        {isComparisonMode ? (
          <>
            <div className="comparison-container">
              <div className="comparison-side">
                <h3>Repository 1</h3>
                <SearchForm 
                  onSearch={(owner, repo) => handleSearch(owner, repo, 'repo1')} 
                  loading={comparisonLoading.repo1}
                  placeholder1="First repository owner"
                  placeholder2="First repository name"
                  buttonText="Add Repository 1"
                  compact={true}
                />
                {repo1Data && (
                  <StatsCard repoData={repo1Data} compact={true} />
                )}
              </div>
              
              <div className="comparison-side">
                <h3>Repository 2</h3>
                <SearchForm 
                  onSearch={(owner, repo) => handleSearch(owner, repo, 'repo2')} 
                  loading={comparisonLoading.repo2}
                  placeholder1="Second repository owner"
                  placeholder2="Second repository name"
                  buttonText="Add Repository 2"
                  compact={true}
                />
                {repo2Data && (
                  <StatsCard repoData={repo2Data} compact={true} />
                )}
              </div>
            </div>
            
            {repo1Data && repo2Data && (
              <RepoComparison repo1Data={repo1Data} repo2Data={repo2Data} />
            )}
          </>
        ) : (
          <>
            {repoData && (
              <>
                <StatsCard repoData={repoData} />
                <LanguageChart languages={languages} />
                <CommitChart commitActivity={commitActivity} />
                <TrendsChart repoData={repoData} commitActivity={commitActivity} />
                <AIInsights 
                  insights={aiInsights} 
                  loading={aiLoading} 
                  error={aiError}
                  onRetry={handleRetryAI}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
