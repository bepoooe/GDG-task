import Groq from 'groq-sdk';

class AIService {
  constructor() {
    this.groq = null;
    this.initializeAI();
  }

  initializeAI() {
    const apiKey = process.env.REACT_APP_GROQ_API_KEY;
    console.log('Groq API Key loaded:', apiKey ? 'Yes' : 'No');
    if (apiKey) {
      this.groq = new Groq({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
      console.log('Groq client initialized successfully');
    } else {
      console.warn('Groq API key not found. Please add REACT_APP_GROQ_API_KEY to your .env.local file');
    }
  }

  async generateWithRetry(prompt, maxRetries = 2) {
    if (!this.groq) {
      throw new Error('AI service not initialized. Please add REACT_APP_GROQ_API_KEY to your .env file');
    }

    console.log('Attempting to generate AI content with Groq...');

    const model = 'llama-3.3-70b-versatile';

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}: Calling Groq API with model ${model}...`);
        const completion = await this.groq.chat.completions.create({
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          model,
          temperature: 0.7,
          max_tokens: 1024,
        });

        console.log(`Groq API call successful with model ${model}`);
        return completion.choices[0]?.message?.content || 'No response generated';
      } catch (error) {
        console.error(`Groq API error with model ${model}:`, error);

        const isRateLimit =
          error.message.includes('429') ||
          error.message.includes('quota') ||
          error.message.includes('rate limit') ||
          error.status === 429 ||
          error.response?.status === 429;

        if (isRateLimit && attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // 2s, 4s
          console.log(`Rate limit hit, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        if (isRateLimit) {
          throw new Error('AI service rate limit exceeded. Please wait a moment before trying again.');
        }

        // Model not found / access errors: surface a clear message
        if (error.message.includes('model_not_found') || error.message.includes('does not exist')) {
          throw new Error('Requested Groq model is unavailable for this key. Please verify access to llama-3.3-70b-versatile.');
        }

        throw error;
      }
    }
  }

  async generateRepositorySummary(repoData, readmeContent) {
    const prompt = `
    Analyze this GitHub repository and provide a comprehensive, insightful summary (3-4 sentences):
    
    Repository Name: ${repoData.name}
    Description: ${repoData.description || 'No description provided'}
    Primary Language: ${repoData.language}
    Stars: ${repoData.stargazers_count}
    Forks: ${repoData.forks_count}
    Open Issues: ${repoData.open_issues_count}
    Last Updated: ${new Date(repoData.updated_at).toLocaleDateString()}
    README Content: ${readmeContent ? readmeContent.substring(0, 1500) : 'No README available'}
    
    Provide insights about:
    1. The repository's primary purpose and target audience
    2. Key features and capabilities based on the description and README
    3. The project's maturity and community engagement level
    4. Potential use cases and significance in the developer ecosystem
    
    Write in a professional yet engaging tone, highlighting what makes this repository noteworthy.
    `;

    try {
      return await this.generateWithRetry(prompt);
    } catch (error) {
      throw new Error(`Failed to generate repository summary: ${error.message}`);
    }
  }

  async generateLanguageAnalysis(languages, repoData) {
    const languageBreakdown = Object.entries(languages)
      .map(([lang, bytes]) => `${lang}: ${bytes} bytes`)
      .join(', ');
    
    const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    const primaryLanguagePercentage = ((languages[repoData.language] || 0) / totalBytes * 100).toFixed(1);

    const prompt = `
    Analyze this repository's technology stack and provide detailed insights (3-4 sentences):
    
    Repository: ${repoData.name}
    Primary Language: ${repoData.language} (${primaryLanguagePercentage}% of codebase)
    Language Breakdown: ${languageBreakdown}
    Total Code Size: ${totalBytes.toLocaleString()} bytes
    
    Provide analysis on:
    1. Technology stack composition and architecture patterns
    2. What the language choices reveal about the project's domain and requirements
    3. Potential advantages and considerations of this tech stack
    4. How the stack aligns with modern development practices and industry trends
    
    Focus on practical insights that would be valuable for developers considering using or contributing to this project.
    `;

    try {
      return await this.generateWithRetry(prompt);
    } catch (error) {
      throw new Error(`Failed to generate language analysis: ${error.message}`);
    }
  }

  async generateContributionAnalysis(contributors, repoData) {
    const topContributors = contributors.slice(0, 5);
    const contributorSummary = topContributors
      .map(c => `${c.login}: ${c.contributions} contributions`)
      .join(', ');
    
    const totalContributions = contributors.reduce((sum, c) => sum + c.contributions, 0);
    const avgContributions = (totalContributions / contributors.length).toFixed(1);
    const topContributorPercentage = ((topContributors[0]?.contributions || 0) / totalContributions * 100).toFixed(1);

    const prompt = `
    Analyze this repository's collaboration and contribution patterns (3-4 sentences):
    
    Repository: ${repoData.name}
    Total Contributors: ${contributors.length}
    Total Contributions: ${totalContributions.toLocaleString()}
    Average Contributions per Contributor: ${avgContributions}
    Top Contributors: ${contributorSummary}
    Top Contributor Share: ${topContributorPercentage}% of total contributions
    Repository Age: Created ${new Date(repoData.created_at).getFullYear()}
    
    Provide insights on:
    1. Collaboration health and community engagement patterns
    2. Contribution distribution and potential bottlenecks
    3. Project maintenance activity and sustainability indicators
    4. Recommendations for improving community participation
    
    Assess whether this is a healthy, sustainable open-source project and what factors contribute to its current state.
    `;

    try {
      return await this.generateWithRetry(prompt);
    } catch (error) {
      throw new Error(`Failed to generate contribution analysis: ${error.message}`);
    }
  }
}

const aiService = new AIService();
export default aiService;
