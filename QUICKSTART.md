# Quick Start Guide

Get up and running with AI Coding Assistant in minutes! This guide will help you set up and start using the application quickly.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Setup](#quick-setup)
- [First Run](#first-run)
- [Basic Usage](#basic-usage)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm 8+** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

### Optional Software
- **Docker** - [Download here](https://www.docker.com/) (for containerized setup)
- **Redis** - For production use (can use Docker)

### API Keys
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)

## Quick Setup

### Option 1: Automated Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-coding-assistant.git
   cd ai-coding-assistant
   ```

2. **Run the setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key
   nano .env
   ```

4. **Start the application**
   ```bash
   npm run dev:all
   ```

### Option 2: Manual Setup

1. **Clone and navigate**
   ```bash
   git clone https://github.com/your-username/ai-coding-assistant.git
   cd ai-coding-assistant
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Add your OpenAI API key to .env
   echo "OPENAI_API_KEY=your-api-key-here" >> .env
   ```

4. **Start development servers**
   ```bash
   # Terminal 1: Backend
   npm run dev
   
   # Terminal 2: Frontend
   cd frontend && npm start
   ```

### Option 3: Docker Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-coding-assistant.git
   cd ai-coding-assistant
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key
   nano .env
   ```

3. **Start with Docker**
   ```bash
   docker-compose up -d
   ```

## First Run

### 1. **Access the Application**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### 2. **Initial Setup**

1. **Open your browser** and navigate to http://localhost:3000
2. **Wait for the application** to load (you'll see a loading screen)
3. **The interface will appear** with the chat interface as the default view

### 3. **First AI Interaction**

1. **Type a message** in the chat input (e.g., "Hello, can you help me create a React project?")
2. **Press Enter** or click the send button
3. **Wait for the AI response** (this may take a few seconds)
4. **The AI will respond** with helpful suggestions and actions

## Basic Usage

### Creating Your First Project

1. **Ask the AI to create a project**
   ```
   "Create a new React project called 'my-first-app'"
   ```

2. **The AI will create the project** and show you the file structure

3. **Navigate to the File Explorer** tab to see your project files

4. **Click on files** to view and edit them

### Using the Chat Interface

- **Ask questions** about coding, best practices, or your project
- **Request code changes** by describing what you want
- **Get explanations** of complex concepts
- **Ask for debugging help** when you encounter issues

### File Management

- **File Explorer tab**: Browse and manage project files
- **Click files** to view and edit them
- **Right-click** for additional options (delete, rename, etc.)
- **Create new files** using the AI or manual creation

### Live Preview

- **Live Preview tab**: See your project in action
- **Device simulation**: Test responsive design
- **Real-time updates**: See changes as you make them
- **Build and run**: Execute your project

### Version Control

- **Version Control tab**: Manage project versions
- **Create snapshots**: Save your work at key points
- **Compare versions**: See what changed between versions
- **Restore versions**: Go back to previous states

### Todo Management

- **Todo List tab**: Track your development tasks
- **Add todos**: Create new tasks
- **Mark complete**: Track your progress
- **Organize**: Categorize and prioritize tasks

## Troubleshooting

### Common Issues

#### **Application Won't Start**
```bash
# Check if ports are available
lsof -i :3000
lsof -i :3001

# Kill processes if needed
kill -9 <PID>
```

#### **OpenAI API Errors**
```bash
# Check your API key
echo $OPENAI_API_KEY

# Test the API
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

#### **Dependency Issues**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm run install:all
```

#### **Frontend Not Loading**
```bash
# Check backend status
curl http://localhost:3001/health

# Restart frontend
cd frontend && npm start
```

### Getting Help

1. **Check the logs**
   ```bash
   npm run logs
   ```

2. **Check system health**
   ```bash
   npm run health
   ```

3. **View monitoring**
   ```bash
   npm run monitoring:status
   ```

4. **Read the full documentation**
   - [README.md](README.md)
   - [SUPPORT.md](SUPPORT.md)
   - [ARCHITECTURE.md](ARCHITECTURE.md)

## Next Steps

### 1. **Explore Features**

- **Try different project types**: React, Next.js, Vite, Vanilla
- **Experiment with AI**: Ask complex questions, request code reviews
- **Use version control**: Create snapshots and compare versions
- **Customize the interface**: Switch languages, adjust themes

### 2. **Learn Advanced Usage**

- **Read the full documentation**: [README.md](README.md)
- **Check the architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Explore the roadmap**: [ROADMAP.md](ROADMAP.md)
- **Join the community**: [CONTRIBUTING.md](CONTRIBUTING.md)

### 3. **Customize and Extend**

- **Modify AI prompts**: Edit `server/managers/AIManager.js`
- **Add new project types**: Extend `shared/constants.ts`
- **Customize the UI**: Modify Material-UI theme
- **Add new features**: Extend the application

### 4. **Deploy to Production**

- **Use Docker**: `docker-compose up -d`
- **Set up monitoring**: Prometheus and Grafana
- **Configure security**: Update environment variables
- **Set up CI/CD**: GitHub Actions or similar

### 5. **Contribute to the Project**

- **Report bugs**: Create GitHub issues
- **Suggest features**: Join discussions
- **Submit code**: Create pull requests
- **Improve documentation**: Help others get started

## Quick Commands Reference

### Development
```bash
npm run dev:all          # Start both frontend and backend
npm run dev              # Start backend only
cd frontend && npm start # Start frontend only
npm run build:all        # Build all components
npm run test             # Run tests
```

### Docker
```bash
docker-compose up -d     # Start all services
docker-compose down      # Stop all services
docker-compose logs      # View logs
docker-compose restart   # Restart services
```

### Monitoring
```bash
npm run health           # Check system health
npm run monitoring:status # View monitoring status
npm run logs             # View application logs
```

### Maintenance
```bash
npm run clean:all        # Clean build artifacts
npm run update:all       # Update dependencies
npm run db:backup        # Backup data
npm run system:health    # System health check
```

## Success Indicators

You've successfully set up AI Coding Assistant when:

✅ **Application starts** without errors  
✅ **Frontend loads** at http://localhost:3000  
✅ **Backend responds** at http://localhost:3001/health  
✅ **AI chat works** and responds to messages  
✅ **Projects can be created** and managed  
✅ **Files can be viewed** and edited  
✅ **Real-time updates** work via Socket.IO  

## Need More Help?

- **Documentation**: [README.md](README.md)
- **Support Guide**: [SUPPORT.md](SUPPORT.md)
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/ai-coding-assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/ai-coding-assistant/discussions)

---

## Welcome to AI Coding Assistant! 🚀

You're now ready to start building amazing projects with AI-powered assistance. The AI will help you:

- **Write better code** with intelligent suggestions
- **Debug issues** faster with AI analysis
- **Learn new technologies** through interactive guidance
- **Manage projects** efficiently with built-in tools
- **Collaborate effectively** with real-time features

Happy coding! 🎉

---

**Last Updated**: January 2024  
**Next Review**: April 2024