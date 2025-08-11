import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { User } from '../../../shared/types'

const prisma = new PrismaClient()

export interface AuthRequest extends Request {
  user?: User
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'No authorization header provided',
        code: 'NO_AUTH_HEADER'
      })
    }

    const token = authHeader.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided',
        code: 'NO_TOKEN'
      })
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      console.error('JWT_SECRET not configured')
      return res.status(500).json({ 
        error: 'Server configuration error',
        code: 'SERVER_CONFIG_ERROR'
      })
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as JWTPayload
      
      // Fetch user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      })

      if (!user) {
        return res.status(401).json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        })
      }

      req.user = user as User
      next()
    } catch (jwtError: any) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expired',
          code: 'TOKEN_EXPIRED'
        })
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          error: 'Invalid token',
          code: 'INVALID_TOKEN'
        })
      } else {
        console.error('JWT verification error:', jwtError)
        return res.status(401).json({ 
          error: 'Token verification failed',
          code: 'TOKEN_VERIFICATION_FAILED'
        })
      }
    }
  } catch (error) {
    console.error('Authentication middleware error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    })
  }
}

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS'
      })
    }

    next()
  }
}

export const generateTokens = (user: User) => {
  const jwtSecret = process.env.JWT_SECRET
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET
  
  if (!jwtSecret || !jwtRefreshSecret) {
    throw new Error('JWT secrets not configured')
  }

  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  }

  const token = jwt.sign(payload, jwtSecret, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
  })
  
  const refreshToken = jwt.sign(payload, jwtRefreshSecret, { 
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' 
  })

  return { token, refreshToken }
}

export const verifyRefreshToken = (refreshToken: string): JWTPayload => {
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET
  
  if (!jwtRefreshSecret) {
    throw new Error('JWT refresh secret not configured')
  }

  return jwt.verify(refreshToken, jwtRefreshSecret) as JWTPayload
}