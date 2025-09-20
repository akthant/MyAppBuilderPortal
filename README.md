# 🚀 Requirement Capture Portal

A revolutionary AI-powered web application that transforms natural language descriptions into fully functional mock user interfaces. Simply describe your app idea, and watch as our intelligent system generates contextual forms, role-based dashboards, and complete UI mockups.

![App Demo](https://myaiappbuilder.netlify.app/)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)


## ✨ Features

### Current Features

- **🤖 AI-Powered Requirement Analysis**: Natural language processing to extract app components
- **🎨 Dynamic UI Generation**: Contextual forms and interfaces based on detected entities
- **👥 Role-Based Navigation**: Intelligent permission filtering for different user roles
- **📱 Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **⚡ Real-Time Processing**: Instant feedback and loading states
- **🛠️ Multiple Field Types**: Support for text, email, select, textarea, date, number, and more
- **🔄 Dynamic Field Validation**: Smart required/optional field detection
- **📊 Dashboard Overview**: Statistics cards and overview panels

### Demo Capabilities

Try describing these types of applications:
- **Educational**: "Student course management system with grades and enrollment"
- **E-commerce**: "Online store with products, orders, and customer management"
- **Healthcare**: "Patient management system with appointments and records"
- **Project Management**: "Task tracking with teams, projects, and milestones"

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript (ES6+)** - Modern JavaScript features

### AI Integration
- **OpenRouter API** - Multi-model AI access (Claude, GPT-4, Gemini)
- **Anthropic Claude** - Advanced reasoning and analysis
- **Natural Language Processing** - Intelligent requirement extraction

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Git** - Version control

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16.0.0 or higher)
- **npm** (version 8.0.0 or higher) or **yarn**
- **Git** for version control
- **OpenRouter API Key** (sign up at [openrouter.ai](https://openrouter.ai))

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/akthant/MyAppBuilderPortal.git
cd MyAppBuilderPortal
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### Step 3: Install Additional Dependencies

```bash
# Core dependencies
npm install axios react-router-dom

# Development dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 4: Configure Tailwind CSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add to `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 🔧 Environment Configuration

### Step 1: Create Environment File

Create a `.env` file in the root directory:

```env
# OpenRouter API Configuration
VITE_OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
VITE_OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
VITE_SITE_URL=http://localhost:5173
VITE_SITE_NAME=My AI App Builder

# Optional: Backend API (for future use)
VITE_API_URL=http://localhost:3001/api
```

### Step 2: Get OpenRouter API Key

1. Visit [openrouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Navigate to the API keys section
4. Generate a new API key
5. Add credits to your account (recommended: $5-10 for testing)
6. Replace `your-actual-api-key-here` with your real API key

### Step 3: Environment Security

Add `.env` to your `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## 🎮 Usage

### Development Server

```bash
# Start the development server
npm run dev

# Or with yarn
yarn dev
```

Visit `http://localhost:5173` in your browser.

### Basic Usage Flow

1. **Enter App Description**: Describe your app in natural language
   ```
   "I want a blog platform where writers create posts, editors review content, and readers leave comments"
   ```

2. **AI Processing**: The system analyzes your description and extracts:
   - App Name: "Blog Platform"
   - Entities: ["Writer", "Post", "Comment", "Editor"]
   - Roles: ["Writer", "Editor", "Reader", "Admin"]
   - Features: ["Create posts", "Review content", "Leave comments", "Manage users"]

3. **Dynamic UI Generation**: View the generated mock interface with:
   - Role-based navigation tabs
   - Contextual forms for each entity
   - Appropriate field types and validation
   - Dashboard overview with statistics

### Example Descriptions

Try these sample descriptions:

**E-learning Platform:**
```
"Create an online learning platform where instructors upload courses, students enroll and take quizzes, and administrators manage the system"
```

**Restaurant Management:**
```
"Build a restaurant app where customers place orders, chefs prepare meals, waiters serve tables, and managers track inventory"
```

**Event Planning:**
```
"Design an event management system where organizers create events, attendees register, vendors provide services, and coordinators manage logistics"
```

## 📁 Project Structure

```
src/
├── App.css
├── App.jsx
├── assets
│   └── react.svg
├── common
├── components
│   ├── forms
│   │   └── RequirementForm.jsx
│   └── ui
│       ├── MockUIGenerator.jsx
│       └── RequirementDisplay.jsx
├── contexts
│   └── AppContext.jsx
├── index.css
├── main.jsx
├── pages
│   └── Home.jsx
└── services
    └── api.js
```

## 🔌 API Integration

### OpenRouter Service (`src/services/api.js`)

```javascript
// Example usage
import { submitRequirements, generateEntityFields } from './services/api';

// Process user requirements
const requirements = await submitRequirements(userDescription);

// Generate fields for specific entity
const fields = await generateEntityFields('Student', 'Course Management App');
```

### Available Functions

- `submitRequirements(description)` - Parse natural language requirements
- `generateEntityFields(entityName, appContext)` - Generate form fields
- `testAPIConnection()` - Test OpenRouter connectivity
- `getAvailableModels()` - List available AI models

## 🌐 Deployment

### Primary Deployment (Netlify) - Recommended

Follow these steps to deploy your app to Netlify:

#### **Step 1: Prepare Your Repository**
```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### **Step 2: Connect to Netlify**
1. **Go to [Netlify](https://netlify.com)** and sign in/create account
2. **Click "Add new site"** → **"Import an existing project"**
3. **Choose "Deploy with Git"** → **Select "GitHub"**
4. **Authorize Netlify** to access only your selected repository
   - Click "Configure the Netlify app on GitHub"
   - Select "Only select repositories"
   - Choose your requirement-capture-portal repository
   - Click "Install & Authorize"

#### **Step 3: Configure Build Settings**
Netlify should auto-detect your settings, but verify:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18 (or your preferred version)

#### **Step 4: Add Environment Variables**
In Netlify dashboard → Site settings → Environment variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `VITE_OPENROUTER_API_KEY` | `sk-or-v1-your-actual-key` | Your OpenRouter API key |
| `VITE_SITE_URL` | `https://your-app.netlify.app` | Your production URL |
| `VITE_SITE_NAME` | `Requirement Portal` | Your app name |

#### **Step 5: Deploy**
1. Click **"Deploy site"**
2. Wait for build to complete (usually 2-3 minutes)
3. Your app will be live at `https://amazing-name-123456.netlify.app`

#### **Step 6: Custom Domain (Optional)**
1. Go to **Domain settings** in Netlify dashboard
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `requirementportal.com`)
4. Follow DNS configuration instructions
5. SSL certificate will be automatically generated

### Continuous Deployment

Once connected, Netlify will automatically:
- ✅ **Redeploy** when you push to your main branch
- ✅ **Run builds** with your environment variables
- ✅ **Generate preview URLs** for pull requests
- ✅ **Handle SSL certificates** automatically

### Alternative Deployment Options

#### **Vercel (Alternative)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### **Other Options**
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3 + CloudFront**: For enterprise-level hosting
- **Firebase Hosting**: Google's hosting solution
- **Railway**: Simple deployment with GitHub integration

## 🚀 Future Enhancements

### Core Improvements

#### **Backend Development**
- **Node.js/Express API**: Full backend implementation
- **MongoDB Integration**: Persistent data storage
- **User Authentication**: JWT-based auth system
- **Project Management**: Save and manage multiple projects

#### **Enhanced AI Capabilities**
- **Multi-Model Support**: GPT-4, Claude, Gemini integration
- **Context Learning**: AI improves from user feedback
- **Advanced Parsing**: Better entity and relationship detection
- **Database Schema Generation**: Auto-generate complete DB structures

## 🌟 Acknowledgments

- **OpenRouter** for multi-model AI API access
- **Anthropic** for Claude AI capabilities
- **Netlify** for hosting and deployment
- **Tailwind CSS** for the design system
- **React Community** for the amazing ecosystem

---

**Built with ❤️ by AK**

*Transform your ideas into applications, one requirement at a time.*