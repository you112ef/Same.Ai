const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const cron = require('node-cron');

// Import custom modules
const ContainerManager = require('./modules/ContainerManager');
const FileManager = require('./modules/FileManager');
const AIService = require('./modules/AIService');
const VersionManager = require('./modules/VersionManager');
const ProjectManager = require('./modules/ProjectManager');
const SecurityManager = require('./modules/SecurityManager');
const LivePreviewManager = require('./modules/LivePreviewManager');

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ai-coding-assistant' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

class AICodingAssistant {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
      }
    });
    
    this.activeSessions = new Map();
    this.containerManager = new ContainerManager();
    this.fileManager = new FileManager();
    this.aiService = new AIService();
    this.versionManager = new VersionManager();
    this.projectManager = new ProjectManager();
    this.securityManager = new SecurityManager();
    this.livePreviewManager = new LivePreviewManager();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketHandlers();
    this.setupCronJobs();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-eval'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "ws:", "wss:"]
        }
      }
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.'
    });
    this.app.use('/api/', limiter);

    // CORS
    this.app.use(cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true
    }));

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Static files
    this.app.use('/static', express.static(path.join(__dirname, '../client/dist')));
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // API Routes
    this.app.use('/api/chat', require('./routes/chat'));
    this.app.use('/api/files', require('./routes/files'));
    this.app.use('/api/projects', require('./routes/projects'));
    this.app.use('/api/versions', require('./routes/versions'));
    this.app.use('/api/preview', require('./routes/preview'));
    this.app.use('/api/deploy', require('./routes/deploy'));
    this.app.use('/api/tools', require('./routes/tools'));

    // Serve React app
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });

    // Error handling middleware
    this.app.use((err, req, res, next) => {
      logger.error('Unhandled error:', err);
      res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
      });
    });
  }

  setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      // Create new session
      socket.on('create-session', async (data) => {
        try {
          const sessionId = uuidv4();
          const session = await this.createSession(sessionId, data);
          socket.sessionId = sessionId;
          socket.emit('session-created', { sessionId, session });
          logger.info(`Session created: ${sessionId}`);
        } catch (error) {
          logger.error('Error creating session:', error);
          socket.emit('error', { message: 'Failed to create session' });
        }
      });

      // Handle chat messages
      socket.on('chat-message', async (data) => {
        try {
          const { message, sessionId } = data;
          const response = await this.handleChatMessage(sessionId, message);
          socket.emit('ai-response', response);
        } catch (error) {
          logger.error('Error handling chat message:', error);
          socket.emit('error', { message: 'Failed to process message' });
        }
      });

      // File operations
      socket.on('file-operation', async (data) => {
        try {
          const { operation, sessionId, ...params } = data;
          const result = await this.handleFileOperation(sessionId, operation, params);
          socket.emit('file-operation-result', result);
        } catch (error) {
          logger.error('Error in file operation:', error);
          socket.emit('error', { message: 'File operation failed' });
        }
      });

      // Live preview updates
      socket.on('preview-request', async (data) => {
        try {
          const { sessionId } = data;
          const previewUrl = await this.livePreviewManager.getPreviewUrl(sessionId);
          socket.emit('preview-update', { url: previewUrl });
        } catch (error) {
          logger.error('Error getting preview:', error);
          socket.emit('error', { message: 'Preview unavailable' });
        }
      });

      // Disconnect handling
      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
        if (socket.sessionId) {
          this.cleanupSession(socket.sessionId);
        }
      });
    });
  }

  async createSession(sessionId, data) {
    const session = {
      id: sessionId,
      createdAt: new Date(),
      language: data.language || 'ar',
      projectType: data.projectType || 'nextjs',
      containerId: null,
      projectPath: null,
      isActive: true
    };

    // Create container for this session
    const container = await this.containerManager.createContainer(sessionId);
    session.containerId = container.id;
    session.projectPath = container.projectPath;

    // Initialize project
    await this.projectManager.initializeProject(session.projectPath, session.projectType);

    // Store session
    this.activeSessions.set(sessionId, session);

    return session;
  }

  async handleChatMessage(sessionId, message) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Analyze message and determine actions
    const analysis = await this.aiService.analyzeMessage(message, session.language);
    
    // Execute actions based on analysis
    const results = await this.executeActions(session, analysis.actions);
    
    // Generate response
    const response = await this.aiService.generateResponse(message, results, session.language);
    
    // Save to session history
    await this.saveToSessionHistory(sessionId, message, response, results);
    
    return response;
  }

  async executeActions(session, actions) {
    const results = [];
    
    for (const action of actions) {
      try {
        let result;
        
        switch (action.type) {
          case 'startup':
            result = await this.projectManager.startup(session.projectPath, action.params);
            break;
          case 'edit_file':
            result = await this.fileManager.editFile(session.projectPath, action.params);
            break;
          case 'read_file':
            result = await this.fileManager.readFile(session.projectPath, action.params);
            break;
          case 'run_linter':
            result = await this.fileManager.runLinter(session.projectPath);
            break;
          case 'bash':
            result = await this.containerManager.executeCommand(session.containerId, action.params.command);
            break;
          case 'web_search':
            result = await this.aiService.webSearch(action.params.query);
            break;
          case 'version_save':
            result = await this.versionManager.saveVersion(session.projectPath, action.params.description);
            break;
          default:
            logger.warn(`Unknown action type: ${action.type}`);
        }
        
        results.push({ action, result, success: true });
      } catch (error) {
        logger.error(`Action execution failed:`, error);
        results.push({ action, error: error.message, success: false });
      }
    }
    
    return results;
  }

  async handleFileOperation(sessionId, operation, params) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    switch (operation) {
      case 'read':
        return await this.fileManager.readFile(session.projectPath, params);
      case 'edit':
        return await this.fileManager.editFile(session.projectPath, params);
      case 'create':
        return await this.fileManager.createFile(session.projectPath, params);
      case 'delete':
        return await this.fileManager.deleteFile(session.projectPath, params);
      case 'list':
        return await this.fileManager.listFiles(session.projectPath, params);
      default:
        throw new Error(`Unknown file operation: ${operation}`);
    }
  }

  async saveToSessionHistory(sessionId, message, response, results) {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    const historyEntry = {
      timestamp: new Date(),
      message,
      response,
      results,
      sessionId
    };

    const historyPath = path.join(session.projectPath, '.same', 'history.md');
    await fs.ensureFile(historyPath);
    
    const historyContent = `## ${historyEntry.timestamp.toISOString()}\n\n**User:** ${message}\n\n**AI Response:** ${response.content}\n\n**Actions:** ${JSON.stringify(results, null, 2)}\n\n---\n\n`;
    await fs.appendFile(historyPath, historyContent);
  }

  async cleanupSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    try {
      // Stop live preview
      await this.livePreviewManager.stopPreview(sessionId);
      
      // Cleanup container
      await this.containerManager.cleanupContainer(session.containerId);
      
      // Remove from active sessions
      this.activeSessions.delete(sessionId);
      
      logger.info(`Session cleaned up: ${sessionId}`);
    } catch (error) {
      logger.error(`Error cleaning up session ${sessionId}:`, error);
    }
  }

  setupCronJobs() {
    // Clean up inactive sessions every hour
    cron.schedule('0 * * * *', async () => {
      const now = new Date();
      const inactiveThreshold = 2 * 60 * 60 * 1000; // 2 hours
      
      for (const [sessionId, session] of this.activeSessions.entries()) {
        const sessionAge = now - session.createdAt;
        if (sessionAge > inactiveThreshold) {
          await this.cleanupSession(sessionId);
        }
      }
    });

    // Clean up old logs daily
    cron.schedule('0 0 * * *', async () => {
      try {
        const logsDir = path.join(__dirname, 'logs');
        const files = await fs.readdir(logsDir);
        const now = new Date();
        const retentionDays = 7;
        
        for (const file of files) {
          const filePath = path.join(logsDir, file);
          const stats = await fs.stat(filePath);
          const fileAge = now - stats.mtime;
          
          if (fileAge > retentionDays * 24 * 60 * 60 * 1000) {
            await fs.remove(filePath);
            logger.info(`Cleaned up old log file: ${file}`);
          }
        }
      } catch (error) {
        logger.error('Error cleaning up logs:', error);
      }
    });
  }

  start(port = process.env.PORT || 3000) {
    this.server.listen(port, () => {
      logger.info(`AI Coding Assistant server running on port ${port}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }
}

// Start the server
const server = new AICodingAssistant();
server.start();

module.exports = AICodingAssistant;