const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Import managers
const FileManager = require('./managers/FileManager');
const VersionManager = require('./managers/VersionManager');
const AIManager = require('./managers/AIManager');

// Store active sessions
const sessions = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Create new session
  socket.on('create-session', async (data) => {
    try {
      const sessionId = generateSessionId();
      const session = {
        id: sessionId,
        language: data.language || 'en',
        projectType: data.projectType || 'react',
        files: new Map(),
        history: [],
        todos: [],
        createdAt: new Date(),
        lastActivity: new Date()
      };
      
      sessions.set(sessionId, session);
      
      // Initialize project directory
      const fileManager = new FileManager(sessionId);
      await fileManager.ensureProjectDirectory();
      
      socket.emit('session-created', { sessionId, session });
      console.log('Session created:', sessionId);
    } catch (error) {
      console.error('Error creating session:', error);
      socket.emit('error', { message: 'Failed to create session' });
    }
  });
  
  // Handle user messages
  socket.on('user-message', async (data) => {
    try {
      const session = sessions.get(data.sessionId);
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }
      
      // Update last activity
      session.lastActivity = new Date();
      
      // Process message with AI
      const aiManager = new AIManager(session);
      const response = await aiManager.processMessage(data.message);
      
      // Execute actions if any
      if (response.actions && response.actions.length > 0) {
        const fileManager = new FileManager(data.sessionId);
        for (const action of response.actions) {
          await executeAction(action, fileManager, session);
        }
      }
      
      // Send response back to client
      socket.emit('ai-response', response);
      
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('error', { message: 'Error processing message' });
    }
  });

  // Handle file operations
  socket.on('file-operation', async (data) => {
    try {
      const session = sessions.get(data.sessionId);
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      const fileManager = new FileManager(data.sessionId);
      let result;

      switch (data.operation) {
        case 'create':
          result = await fileManager.createProject(data.projectType);
          break;
        case 'edit':
          result = await fileManager.editFile(data.filePath, data.content, data.options);
          break;
        case 'read':
          result = await fileManager.readFile(data.filePath);
          break;
        case 'delete':
          result = await fileManager.deleteFile(data.filePath);
          break;
        case 'list':
          result = await fileManager.listFiles(data.directory);
          break;
        default:
          throw new Error(`Unknown operation: ${data.operation}`);
      }

      socket.emit('file-operation-result', { operation: data.operation, result });
    } catch (error) {
      console.error('Error in file operation:', error);
      socket.emit('error', { message: 'File operation failed' });
    }
  });

  // Handle version control operations
  socket.on('version-operation', async (data) => {
    try {
      const session = sessions.get(data.sessionId);
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      const versionManager = new VersionManager(data.sessionId);
      let result;

      switch (data.operation) {
        case 'create-snapshot':
          result = await versionManager.createSnapshot(data.description, data.metadata);
          break;
        case 'list-versions':
          result = await versionManager.listVersions();
          break;
        case 'get-version':
          result = await versionManager.getVersion(data.versionId);
          break;
        case 'restore-version':
          result = await versionManager.restoreVersion(data.versionId);
          break;
        case 'compare-versions':
          result = await versionManager.compareVersions(data.versionId1, data.versionId2);
          break;
        case 'export-version':
          result = await versionManager.exportVersion(data.versionId, data.format);
          break;
        case 'delete-version':
          result = await versionManager.deleteVersion(data.versionId);
          break;
        default:
          throw new Error(`Unknown version operation: ${data.operation}`);
      }

      socket.emit('version-operation-result', { operation: data.operation, result });
    } catch (error) {
      console.error('Error in version operation:', error);
      socket.emit('error', { message: 'Version operation failed' });
    }
  });

  // Handle project operations
  socket.on('project-operation', async (data) => {
    try {
      const session = sessions.get(data.sessionId);
      if (!session) {
        socket.emit('error', { message: 'Session not found' });
        return;
      }

      const fileManager = new FileManager(data.sessionId);
      let result;

      switch (data.operation) {
        case 'build':
          result = await fileManager.buildProject();
          break;
        case 'install-deps':
          result = await fileManager.installDependencies();
          break;
        case 'start-dev':
          result = await fileManager.startDevServer();
          break;
        case 'get-stats':
          result = await fileManager.getProjectStats();
          break;
        default:
          throw new Error(`Unknown project operation: ${data.operation}`);
      }

      socket.emit('project-operation-result', { operation: data.operation, result });
    } catch (error) {
      console.error('Error in project operation:', error);
      socket.emit('error', { message: 'Project operation failed' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Clean up session if inactive
    for (const [sessionId, session] of sessions.entries()) {
      if (session.socketId === socket.id) {
        session.socketId = null;
        break;
      }
    }
  });
});

// Execute AI actions
async function executeAction(action, fileManager, session) {
  try {
    switch (action.type) {
      case 'create_project':
        await fileManager.createProject(action.params.projectType);
        break;
      case 'edit_file':
        await fileManager.editFile(action.params.filePath, action.params.content, action.params.options);
        break;
      case 'run_command':
        await fileManager.runCommand(action.params.command);
        break;
      case 'create_snapshot':
        const versionManager = new VersionManager(session.id);
        await versionManager.createSnapshot(action.params.description);
        break;
      default:
        console.log('Unknown action type:', action.type);
    }
  } catch (error) {
    console.error('Error executing action:', error);
    throw error;
  }
}

// Generate unique session ID
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Clean up inactive sessions
function cleanupInactiveSessions() {
  const now = new Date();
  const inactiveThreshold = 60 * 60 * 1000; // 1 hour
  
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActivity > inactiveThreshold) {
      console.log('Cleaning up inactive session:', sessionId);
      sessions.delete(sessionId);
      
      // Clean up project files
      const FileManager = require('./managers/FileManager');
      const fileManager = new FileManager(sessionId);
      fileManager.cleanupProject().catch(console.error);
    }
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    activeSessions: sessions.size,
    uptime: process.uptime()
  });
});

app.get('/api/sessions', (req, res) => {
  const activeSessions = Array.from(sessions.values()).map(session => ({
    id: session.id,
    language: session.language,
    projectType: session.projectType,
    createdAt: session.createdAt,
    lastActivity: session.lastActivity
  }));
  res.json({ sessions: activeSessions });
});

app.get('/api/sessions/:sessionId', (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  res.json({
    id: session.id,
    language: session.language,
    projectType: session.projectType,
    createdAt: session.createdAt,
    lastActivity: session.lastActivity,
    fileCount: session.files.size,
    historyLength: session.history.length
  });
});

app.delete('/api/sessions/:sessionId', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const session = sessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Clean up project files
    const fileManager = new FileManager(sessionId);
    await fileManager.cleanupProject();
    
    // Remove session
    sessions.delete(sessionId);
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 AI Coding Assistant Server running on port ${PORT}`);
  console.log(`📱 Frontend will be available at http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO server ready for connections`);
  console.log(`📊 Active sessions: ${sessions.size}`);
});

// Schedule cleanup of inactive sessions
setInterval(cleanupInactiveSessions, 30 * 60 * 1000); // Every 30 minutes

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});