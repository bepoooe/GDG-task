import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

class GitHubService {
  constructor() {
    this.api = axios.create({
      baseURL: GITHUB_API_BASE,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(process.env.REACT_APP_GITHUB_TOKEN && {
          'Authorization': `token ${process.env.REACT_APP_GITHUB_TOKEN}`
        })
      }
    });
  }

  async getRepository(owner, repo) {
    try {
      console.log(`Fetching repository data for ${owner}/${repo}...`);
      const response = await this.api.get(`/repos/${owner}/${repo}`);
      console.log('Repository data fetched successfully');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch repository: ${error.message}`);
    }
  }

  async getLanguages(owner, repo) {
    try {
      console.log(`Fetching languages for ${owner}/${repo}...`);
      const response = await this.api.get(`/repos/${owner}/${repo}/languages`);
      console.log('Languages fetched:', response.data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch languages: ${error.message}`);
    }
  }

  async getCommitActivity(owner, repo) {
    const maxAttempts = 6; // ~1.5s to ~16s total with exponential backoff
    let attempt = 0;

    while (attempt < maxAttempts) {
      try {
        attempt += 1;
        console.log(`Fetching commit activity for ${owner}/${repo}... (attempt ${attempt}/${maxAttempts})`);
        const response = await this.api.get(`/repos/${owner}/${repo}/stats/commit_activity`, {
          validateStatus: () => true // allow handling of 202 here
        });

        const { status, data, headers } = response;
        console.log('Commit activity response status:', status);
        console.log('Commit activity response:', data);

        // GitHub often returns 202 while calculating stats; data may be null or object
        const isProcessing = status === 202 || data === null || !Array.isArray(data);
        if (isProcessing) {
          if (attempt >= maxAttempts) {
            console.log('Commit activity still processing after max attempts; returning empty array.');
            return [];
          }
          const retryAfterHeader = headers && (headers['retry-after'] || headers['Retry-After']);
          const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : Math.pow(2, attempt) * 250; // 250ms, 500ms, 1s, 2s, 4s, 8s
          console.log(`Commit activity not ready (status ${status}). Retrying in ${retryAfterMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryAfterMs));
          continue;
        }

        // Ready and array
        console.log('Commit activity ready. Weeks:', Array.isArray(data) ? data.length : 0);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.warn(`Failed to fetch commit activity (attempt ${attempt}): ${error.message}`);
        if (attempt >= maxAttempts) {
          return [];
        }
        const backoffMs = Math.pow(2, attempt) * 250;
        console.log(`Retrying commit activity in ${backoffMs}ms due to error...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs));
      }
    }

    return [];
  }

  async getContributors(owner, repo) {
    try {
      console.log(`Fetching contributors for ${owner}/${repo}...`);
      const response = await this.api.get(`/repos/${owner}/${repo}/contributors`);
      console.log('Contributors fetched:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.warn(`Failed to fetch contributors: ${error.message}`);
      return []; // Return empty array instead of throwing error
    }
  }

  async getReadme(owner, repo) {
    try {
      console.log(`Fetching README for ${owner}/${repo}...`);
      const response = await this.api.get(`/repos/${owner}/${repo}/readme`);
      console.log('README fetched successfully');
      // Decode base64 content
      return atob(response.data.content);
    } catch (error) {
      console.log('README not found or failed to fetch:', error.message);
      // README might not exist
      return null;
    }
  }
}

const githubService = new GitHubService();
export default githubService;
