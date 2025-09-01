# 📊 GitHub Repository Insights Dashboard  

> A **Progressive Web App (PWA)** that delivers **AI-powered insights** into any public GitHub repository.  
Fetch live data, visualize it with **interactive charts**, and unlock smart summaries powered by **Groq AI** 🚀  

<p align="center">
  <img src="screenshots/dashboard.png" alt="Dashboard Preview" width="800"/>
</p>

---

## 🔥 Badges  

![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react&logoColor=white)  
![PWA](https://img.shields.io/badge/PWA-Ready-orange?logo=pwa&logoColor=white)  
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)  
![Contributions](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)  
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)  

---

## ✨ Features  

### 📌 Core  
- 🔍 **Repository Search** (Owner + Repo input)  
- 📊 **Core Stats Card** (Stars, Forks, Issues, License)  
- 🟦 **Language Composition Pie Chart**  
- 📈 **Commit Activity Timeline (52 Weeks)**  
- 🔗 **Direct GitHub Links**  

### 🤖 AI Insights (Groq-powered)  
- 📝 **Comprehensive Repository Summary** with purpose and target audience analysis
- 🛠️ **Advanced Technology Stack Analysis** with architecture insights
- 👥 **Detailed Contribution Patterns** with collaboration health assessment
- 🎯 **Professional-grade insights** powered by Groq's fast LLM inference

### 📱 PWA  
- 📲 **Installable** like a native app  
- 📶 **Offline support** via Service Worker  
- ⚡ **Fast loading** with caching  
- 🖥️ **Responsive UI** with modern EduBh-inspired design

---

## 🎨 Design Features

- **Modern UI**: Inspired by [EduBh](https://edu-bh.vercel.app/) with professional color schemes
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Professional Typography**: Clean, readable fonts with proper hierarchy
- **Responsive Design**: Optimized for all device sizes
- **Interactive Elements**: Enhanced user experience with visual feedback

---

## 🛠️ Tech Stack  

| Category      | Technology |
|---------------|------------|
| **Frontend**  | React 19.1.1 |
| **Charts**    | Recharts |
| **AI**        | Groq API |
| **HTTP**      | Axios |
| **PWA**       | Workbox |
| **Styling**   | CSS3 with modern gradients |
| **Icons**     | Lucide React |
| **Build Tool**| Create React App |

---

## 🚀 Quick Start  

```bash
# Clone repo
git clone https://github.com/yourusername/github-insights.git
cd github-insights

# Install dependencies
npm install

# Set up Groq API key
echo "REACT_APP_GROQ_API_KEY=your_groq_api_key" > .env.local

# Run locally
npm start
```

## 🔑 API Setup

**Required**: Groq API key for AI insights functionality.

1. Get your API key from [Groq Console](https://console.groq.com/)
2. Create a `.env.local` file in the root directory
3. Add: `REACT_APP_GROQ_API_KEY=your_key_here`
4. Restart the application

💡 **Benefits of Groq**: Much higher rate limits compared to free Gemini API, faster inference, and more reliable service.

## 🏗️ Architecture

```
src/
├── components/
│   ├── SearchForm.js          # Repository search interface
│   ├── StatsCard.js           # Repository statistics display
│   ├── LanguageChart.js       # Language composition visualization
│   ├── CommitChart.js         # Commit activity timeline
│   ├── AIInsights.js          # AI-powered insights display
│   └── LoadingSpinner.js      # Loading states
├── services/
│   ├── githubService.js       # GitHub API integration
│   └── aiService.js           # Groq AI integration
└── App.js                     # Main application component
```

## 📄 License

This project is licensed under the MIT License – see the LICENSE file for details.
