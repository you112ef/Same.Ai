# AI Coding Assistant

An intelligent coding companion that helps developers create, manage, and maintain projects with AI-powered assistance.

## 🌟 Features

### 🤖 AI-Powered Development
- **Intelligent Code Generation**: Generate code based on natural language descriptions
- **Code Analysis**: Get insights and suggestions for your code
- **Multi-language Support**: Works with JavaScript, TypeScript, Python, and more
- **Context-Aware**: Understands your project structure and history

### 📁 Project Management
- **File Explorer**: Browse and manage project files with ease
- **Live Preview**: See changes in real-time as you code
- **Version Control**: Create snapshots and manage project versions
- **Todo Management**: Track tasks and project progress

### 🌐 Multi-Language Interface
- **Arabic & English**: Full support for both languages
- **RTL Support**: Proper right-to-left layout for Arabic
- **Localized Content**: All UI elements in your preferred language

### 🔒 Security & Performance
- **Session Management**: Secure user sessions with unique IDs
- **Rate Limiting**: Protect against abuse and overload
- **File Isolation**: Projects are isolated for security
- **Real-time Updates**: Socket.IO for instant communication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-coding-assistant
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key and other settings
   ```

4. **Start the application**
   ```bash
   # Development mode (both frontend and backend)
   npm run dev:all
   
   # Or start separately:
   npm run dev          # Backend only
   cd frontend && npm start  # Frontend only
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Server**: Express.js with Socket.IO for real-time communication
- **AI Integration**: OpenAI GPT-4 API integration
- **File Management**: Project creation, file operations, versioning
- **Session Management**: User session handling and security

### Frontend (React + TypeScript)
- **UI Framework**: Material-UI with custom theming
- **State Management**: React hooks for local state
- **Real-time Communication**: Socket.IO client for live updates
- **Responsive Design**: Works on desktop and mobile devices

### Key Components
- **ChatInterface**: AI chat and code generation
- **FileExplorer**: File and directory management
- **LivePreview**: Real-time project preview
- **VersionControl**: Project versioning and snapshots
- **TodoList**: Task management and tracking

## 📚 Usage Examples

### Creating a New Project
1. Open the chat interface
2. Type: "Create a new React project with TypeScript"
3. The AI will generate the project structure and files
4. Use the file explorer to browse and edit files

### Getting Code Help
1. Ask questions like: "How do I implement authentication?"
2. The AI will provide code examples and explanations
3. Use the suggestions to improve your code

### Managing Versions
1. Create snapshots of your project at key milestones
2. Compare different versions to see changes
3. Restore previous versions if needed

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode
- `PROJECTS_DIR`: Directory for storing projects
- `VERSIONS_DIR`: Directory for project versions

### Customization
- Modify themes in `frontend/src/App.tsx`
- Add new project types in `server/managers/FileManager.js`
- Extend AI capabilities in `server/managers/AIManager.js`

## 🐳 Docker Support

### Using Docker Compose
```bash
docker-compose up -d
```

### Building Custom Image
```bash
docker build -t ai-coding-assistant .
docker run -p 3001:3001 ai-coding-assistant
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use Material-UI components consistently
- Maintain Arabic/English language parity
- Write clear commit messages

## 🐛 Troubleshooting

### Common Issues

**Frontend won't start**
- Check if Node.js version is 18+
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

**Backend connection failed**
- Verify OpenAI API key in `.env`
- Check if port 3001 is available
- Ensure all dependencies are installed

**AI responses are slow**
- Check OpenAI API rate limits
- Verify internet connection
- Consider upgrading to GPT-4 Turbo

### Logs
- Backend logs: `./logs/app.log`
- Frontend logs: Browser console
- Socket.IO logs: Backend console

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- Material-UI team for the excellent component library
- Socket.IO for real-time communication capabilities
- The open-source community for inspiration and tools

## 📞 Support

- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Email**: [your-email@example.com]

---

**Made with ❤️ by the AI Coding Assistant Team**