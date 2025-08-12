import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client'
import { createClient } from 'redis'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Import routes
import authRoutes from './routes/auth'
import conversationRoutes from './routes/conversations'
import messageRoutes from './routes/messages'
import fileRoutes from './routes/files'
import aiRoutes from './routes/ai'
import userRoutes from './routes/users'
import generatorRoutes from './routes/generator'

// Import middleware
import { errorHandler } from './middleware/errorHandler'
import { authenticate } from './middleware/auth'

// Import socket handlers
import { setupSocketHandlers } from './services/socketService'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Initialize Prisma
export const prisma = new PrismaClient()

// Initialize Redis
export const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

const PORT = process.env.PORT || 5000

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
})

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}))

app.use(compression())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(limiter)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/conversations', authenticate, conversationRoutes)
app.use('/api/messages', authenticate, messageRoutes)
app.use('/api/files', authenticate, fileRoutes)
app.use('/api/ai', authenticate, aiRoutes)
app.use('/api/users', authenticate, userRoutes)
app.use('/api/generator', generatorRoutes)

// Setup Socket.IO handlers
setupSocketHandlers(io)

// Error handling middleware (must be last)
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  
  // Close server
  server.close(() => {
    console.log('HTTP server closed')
  })
  
  // Close database connection
  await prisma.$disconnect()
  console.log('Database disconnected')
  
  // Close Redis connection
  await redis.quit()
  console.log('Redis disconnected')
  
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully')
  
  server.close(() => {
    console.log('HTTP server closed')
  })
  
  await prisma.$disconnect()
  await redis.quit()
  
  process.exit(0)
})

// Start server
const startServer = async () => {
  try {
    // Try to connect to Redis (optional)
    try {
      await redis.connect()
      console.log('✅ Connected to Redis')
    } catch (redisError) {
      console.log('⚠️  Redis not available, continuing without caching')
    }

    // Try to connect to database (optional for development)
    try {
      await prisma.$connect()
      console.log('✅ Connected to PostgreSQL')
    } catch (dbError) {
      console.log('⚠️  Database not available, some features may not work')
      console.log('💡 To set up database: install PostgreSQL and update DATABASE_URL in .env')
    }

    // Start server regardless of DB/Redis status
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/health`)
      console.log(`🔗 Socket.IO ready for connections`)
      console.log(`🌐 Frontend should be available at: http://localhost:3000`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
