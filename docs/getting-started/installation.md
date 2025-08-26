# Installation Guide

Complete installation instructions for AI Coding Assistant across different platforms and environments.

## 📋 System Requirements

### **Minimum Requirements**
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 18.0.0 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB available space
- **Network**: Stable internet connection for AI features

### **Recommended Requirements**
- **Operating System**: Latest stable version
- **Node.js**: Version 20.0.0 or higher (LTS)
- **RAM**: 16GB or more
- **Storage**: 10GB available space (SSD recommended)
- **Network**: High-speed internet connection
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### **Development Requirements**
- **Git**: Version 2.30.0 or higher
- **Text Editor**: VS Code, Sublime Text, or Vim
- **Terminal**: PowerShell (Windows), Terminal (macOS), or Bash (Linux)
- **Package Manager**: npm 8.0.0+ or yarn 1.22.0+

## 🔧 Installation Methods

### **Method 1: Global NPM Installation (Recommended)**

#### **Step 1: Install Node.js**
```bash
# Download from official website
# https://nodejs.org/en/download/

# Or use package manager

# On macOS with Homebrew
brew install node

# On Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# On Windows with Chocolatey
choco install nodejs

# On Windows with Scoop
scoop install nodejs
```

#### **Step 2: Verify Installation**
```bash
# Check Node.js version
node --version
# Should show v18.0.0 or higher

# Check npm version
npm --version
# Should show v8.0.0 or higher

# Check Git version
git --version
# Should show v2.30.0 or higher
```

#### **Step 3: Install AI Coding Assistant**
```bash
# Install globally
npm install -g ai-coding-assistant

# Verify installation
ai-coding-assistant --version
```

#### **Step 4: Initialize Configuration**
```bash
# Create configuration directory
mkdir ~/.ai-coding-assistant

# Initialize configuration
ai-coding-assistant init --config

# This will create:
# ~/.ai-coding-assistant/config.json
# ~/.ai-coding-assistant/credentials.json
```

### **Method 2: Docker Installation**

#### **Prerequisites**
```bash
# Install Docker
# https://docs.docker.com/get-docker/

# Verify Docker installation
docker --version
docker-compose --version
```

#### **Step 1: Pull Image**
```bash
# Pull the official image
docker pull ai-coding-assistant/app:latest

# Or pull specific version
docker pull ai-coding-assistant/app:v1.0.0
```

#### **Step 2: Run Container**
```bash
# Basic run
docker run -p 3000:3000 ai-coding-assistant/app:latest

# With persistent storage
docker run -d \
  --name ai-coding-assistant \
  -p 3000:3000 \
  -v ~/ai-coding-assistant:/app/data \
  -e NODE_ENV=production \
  ai-coding-assistant/app:latest

# With custom configuration
docker run -d \
  --name ai-coding-assistant \
  -p 3000:3000 \
  -v ~/ai-coding-assistant:/app/data \
  -v ~/.ai-coding-assistant/config.json:/app/config/config.json \
  ai-coding-assistant/app:latest
```

#### **Step 3: Docker Compose (Recommended)**
```yaml
# docker-compose.yml
version: '3.8'
services:
  ai-coding-assistant:
    image: ai-coding-assistant/app:latest
    container_name: ai-coding-assistant
    ports:
      - "3000:3000"
    volumes:
      - ~/ai-coding-assistant:/app/data
      - ~/.ai-coding-assistant:/app/config
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    restart: unless-stopped
    networks:
      - ai-coding-network

  postgres:
    image: postgres:15
    container_name: ai-coding-postgres
    environment:
      - POSTGRES_DB=ai_coding_assistant
      - POSTGRES_USER=ai_user
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - ai-coding-network

  redis:
    image: redis:7-alpine
    container_name: ai-coding-redis
    volumes:
      - redis_data:/data
    networks:
      - ai-coding-network

volumes:
  postgres_data:
  redis_data:

networks:
  ai-coding-network:
    driver: bridge
```

```bash
# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f ai-coding-assistant
```

### **Method 3: Local Development Installation**

#### **Step 1: Clone Repository**
```bash
# Clone the repository
git clone https://github.com/ai-coding-assistant/ai-coding-assistant.git
cd ai-coding-assistant

# Checkout stable version
git checkout v1.0.0

# Or use latest development version
git checkout main
```

#### **Step 2: Install Dependencies**
```bash
# Install Node.js dependencies
npm install

# Install Python dependencies (if using Python features)
pip install -r requirements.txt

# Install system dependencies (Linux)
sudo apt-get update
sudo apt-get install -y build-essential python3-dev
```

#### **Step 3: Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env

# Required variables:
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/ai_coding_assistant
REDIS_URL=redis://localhost:6379
SECRET_KEY=your_secret_key_here
NODE_ENV=development
```

#### **Step 4: Database Setup**
```bash
# Install PostgreSQL
# https://www.postgresql.org/download/

# Create database
createdb ai_coding_assistant

# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

#### **Step 5: Start Development Server**
```bash
# Start all services
npm run dev

# Or start individually
npm run dev:server    # Backend server
npm run dev:client    # Frontend development
npm run dev:worker    # Background workers
```

## 🌐 Platform-Specific Installation

### **Windows Installation**

#### **Using Windows Package Manager**
```powershell
# Install with winget
winget install AI-Coding-Assistant.AI-Coding-Assistant

# Install with Chocolatey
choco install ai-coding-assistant

# Install with Scoop
scoop install ai-coding-assistant
```

#### **Manual Windows Installation**
```powershell
# Download installer from GitHub releases
# https://github.com/ai-coding-assistant/ai-coding-assistant/releases

# Run installer as administrator
# Follow installation wizard

# Add to PATH if not automatic
# C:\Users\%USERNAME%\AppData\Roaming\npm
```

#### **Windows Subsystem for Linux (WSL)**
```bash
# Install WSL2
wsl --install

# Install Node.js in WSL
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install AI Coding Assistant
npm install -g ai-coding-assistant
```

### **macOS Installation**

#### **Using Homebrew**
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install AI Coding Assistant
brew install ai-coding-assistant/tap/ai-coding-assistant

# Or install from source
brew install --build-from-source ai-coding-assistant
```

#### **Using MacPorts**
```bash
# Install MacPorts
# https://www.macports.org/install.php

# Install AI Coding Assistant
sudo port install ai-coding-assistant
```

#### **Manual macOS Installation**
```bash
# Download macOS installer
# https://github.com/ai-coding-assistant/ai-coding-assistant/releases

# Mount DMG file
# Drag to Applications folder

# Install command line tools
npm install -g ai-coding-assistant
```

### **Linux Installation**

#### **Ubuntu/Debian**
```bash
# Add repository
curl -fsSL https://packages.ai-coding-assistant.com/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/ai-coding-assistant.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/ai-coding-assistant.gpg] https://packages.ai-coding-assistant.com/ubuntu $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/ai-coding-assistant.list

# Update and install
sudo apt update
sudo apt install ai-coding-assistant
```

#### **CentOS/RHEL/Fedora**
```bash
# Add repository
sudo dnf install https://packages.ai-coding-assistant.com/rpm/ai-coding-assistant.repo

# Install package
sudo dnf install ai-coding-assistant

# Or for older versions
sudo yum install ai-coding-assistant
```

#### **Arch Linux**
```bash
# Using AUR helper
yay -S ai-coding-assistant

# Or manually
git clone https://aur.archlinux.org/ai-coding-assistant.git
cd ai-coding-assistant
makepkg -si
```

#### **Snap Installation**
```bash
# Install snapd if not available
sudo apt install snapd

# Install AI Coding Assistant
sudo snap install ai-coding-assistant

# Connect to system resources
sudo snap connect ai-coding-assistant:home
sudo snap connect ai-coding-assistant:removable-media
```

## 🔐 Configuration Setup

### **Initial Configuration**
```bash
# Run configuration wizard
ai-coding-assistant config

# This will prompt for:
# - OpenAI API key
# - Database configuration
# - Email settings
# - Security settings
# - AI model preferences
```

### **Configuration File Structure**
```json
// ~/.ai-coding-assistant/config.json
{
  "app": {
    "name": "AI Coding Assistant",
    "version": "1.0.0",
    "environment": "production",
    "port": 3000,
    "host": "0.0.0.0"
  },
  "database": {
    "type": "postgresql",
    "host": "localhost",
    "port": 5432,
    "name": "ai_coding_assistant",
    "username": "ai_user",
    "password": "encrypted_password",
    "ssl": true,
    "pool": {
      "min": 2,
      "max": 10
    }
  },
  "redis": {
    "host": "localhost",
    "port": 6379,
    "password": null,
    "db": 0
  },
  "ai": {
    "provider": "openai",
    "apiKey": "encrypted_api_key",
    "model": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 2000,
    "timeout": 30000
  },
  "security": {
    "jwtSecret": "encrypted_jwt_secret",
    "bcryptRounds": 12,
    "sessionTimeout": 86400000,
    "maxLoginAttempts": 5,
    "lockoutDuration": 900000
  },
  "email": {
    "provider": "smtp",
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": true,
    "username": "your_email@gmail.com",
    "password": "encrypted_password"
  },
  "storage": {
    "type": "local",
    "path": "/app/data/storage",
    "maxFileSize": 104857600,
    "allowedTypes": ["js", "jsx", "ts", "tsx", "html", "css", "json", "md"]
  },
  "collaboration": {
    "realTime": true,
    "maxUsers": 100,
    "autoSave": true,
    "conflictResolution": "manual"
  }
}
```

### **Environment Variables**
```bash
# .env file
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_coding_assistant
REDIS_URL=redis://localhost:6379

# AI Services
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Security
JWT_SECRET=your_jwt_secret
BCRYPT_ROUNDS=12
SESSION_SECRET=your_session_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# Storage
STORAGE_PATH=/app/data/storage
MAX_FILE_SIZE=104857600

# External Services
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🧪 Verification & Testing

### **Test Installation**
```bash
# Check version
ai-coding-assistant --version

# Check configuration
ai-coding-assistant config --show

# Test AI connection
ai-coding-assistant test --ai

# Test database connection
ai-coding-assistant test --database

# Run health check
ai-coding-assistant health
```

### **Start Application**
```bash
# Start in development mode
ai-coding-assistant dev

# Start in production mode
ai-coding-assistant start

# Start with custom port
ai-coding-assistant start --port 3001

# Start with custom host
ai-coding-assistant start --host 127.0.0.1
```

### **Access Application**
- **Web Interface**: http://localhost:3000
- **API Endpoints**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health
- **Documentation**: http://localhost:3000/docs

## 🔧 Troubleshooting

### **Common Installation Issues**

#### **Permission Errors**
```bash
# Fix npm permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config

# Or use nvm for Node.js management
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

#### **Port Already in Use**
```bash
# Check what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
ai-coding-assistant start --port 3001
```

#### **Database Connection Issues**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL if stopped
sudo systemctl start postgresql

# Check connection
psql -h localhost -U ai_user -d ai_coding_assistant
```

#### **AI API Issues**
```bash
# Verify API key
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.openai.com/v1/models

# Check rate limits
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.openai.com/v1/usage
```

### **Logs and Debugging**
```bash
# View application logs
ai-coding-assistant logs

# View specific log file
tail -f ~/.ai-coding-assistant/logs/app.log

# Enable debug mode
DEBUG=* ai-coding-assistant start

# Check system resources
htop
df -h
free -h
```

## 🔄 Updates & Maintenance

### **Update Application**
```bash
# Update global installation
npm update -g ai-coding-assistant

# Update Docker image
docker pull ai-coding-assistant/app:latest

# Update local installation
cd ai-coding-assistant
git pull origin main
npm install
npm run build
```

### **Backup Configuration**
```bash
# Backup configuration
cp -r ~/.ai-coding-assistant ~/.ai-coding-assistant.backup

# Backup database
pg_dump ai_coding_assistant > backup.sql

# Backup storage
tar -czf storage-backup.tar.gz /app/data/storage
```

### **Uninstall Application**
```bash
# Remove global installation
npm uninstall -g ai-coding-assistant

# Remove Docker container
docker stop ai-coding-assistant
docker rm ai-coding-assistant
docker rmi ai-coding-assistant/app:latest

# Remove local installation
rm -rf ~/ai-coding-assistant
rm -rf ~/.ai-coding-assistant
```

## 📚 Next Steps

### **After Installation**
1. **[Quick Start Guide](./quick-start.md)** - Get up and running
2. **[First Project](./first-project.md)** - Create your first project
3. **[Configuration Guide](../configuration/README.md)** - Advanced configuration
4. **[User Interface Guide](../user-guides/interface.md)** - Learn the platform

### **Advanced Setup**
- **[Production Deployment](../deployment/README.md)** - Deploy to production
- **[Docker Configuration](../deployment/docker.md)** - Advanced Docker setup
- **[Security Hardening](../security/README.md)** - Security best practices
- **[Performance Tuning](../performance/README.md)** - Optimize performance

---

**Next**: [Quick Start Guide](./quick-start.md) | [First Project](./first-project.md) | [Configuration](../configuration/README.md)

---

**Last Updated**: January 2024  
**Next Review**: April 2024