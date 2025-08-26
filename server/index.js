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
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX), // limit each IP to 100 requests per windowMs
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
        language: data.language || 'ar',
        projectType: data.projectType || 'nextjs',
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
      socket.emit('error', { message: 'فشل في إنشاء الجلسة' });
    }
  });
  
  // Handle user messages
  socket.on('user-message', async (data) => {
    try {
      const session = sessions.get(data.sessionId);
      if (!session) {
        socket.emit('error', { message: 'الجلسة غير موجودة' });
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
      
      // Send response back to user
      socket.emit('ai-response', {
        message: response.message,
        actions: response.actions || [],
        session: session
      });
      
    } catch (error) {
      console.error('Error processing message:', error);
      socket.emit('error', { message: 'حدث خطأ في معالجة الرسالة' });
    }
  });
  
  // Handle file operations
  socket.on('read-file', async (data) => {
    try {
      const fileManager = new FileManager(data.sessionId);
      const result = await fileManager.readFile(data.filePath);
      socket.emit('file-read', result);
    } catch (error) {
      console.error('Error reading file:', error);
      socket.emit('error', { message: 'فشل في قراءة الملف' });
    }
  });
  
  socket.on('edit-file', async (data) => {
    try {
      const fileManager = new FileManager(data.sessionId);
      const result = await fileManager.editFile(data.filePath, data.content, data.options);
      socket.emit('file-edited', result);
    } catch (error) {
      console.error('Error editing file:', error);
      socket.emit('error', { message: 'فشل في تعديل الملف' });
    }
  });
  
  // Handle project creation
  socket.on('create-project', async (data) => {
    try {
      const fileManager = new FileManager(data.sessionId);
      const result = await fileManager.createProject(data.projectType);
      socket.emit('project-created', result);
    } catch (error) {
      console.error('Error creating project:', error);
      socket.emit('error', { message: 'فشل في إنشاء المشروع' });
    }
  });
  
  // Handle versioning
  socket.on('create-snapshot', async (data) => {
    try {
      const versionManager = new VersionManager(data.sessionId);
      const result = await versionManager.createSnapshot(data.description);
      socket.emit('snapshot-created', result);
    } catch (error) {
      console.error('Error creating snapshot:', error);
      socket.emit('error', { message: 'فشل في إنشاء النسخة' });
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Clean up session after some time
    setTimeout(() => {
      cleanupInactiveSessions();
    }, 30 * 60 * 1000); // 30 minutes
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
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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
});

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