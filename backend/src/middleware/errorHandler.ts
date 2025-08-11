import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { APIError } from '../../../shared/types'

export class CustomError extends Error {
  statusCode: number
  code: string
  details?: Record<string, unknown>

  constructor(
    message: string, 
    statusCode: number = 500, 
    code: string = 'INTERNAL_ERROR',
    details?: Record<string, unknown>
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.name = 'CustomError'
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error caught by error handler:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  })

  let statusCode = 500
  let code = 'INTERNAL_ERROR'
  let message = 'An unexpected error occurred'
  let details: Record<string, unknown> | undefined

  // Handle custom errors
  if (error instanceof CustomError) {
    statusCode = error.statusCode
    code = error.code
    message = error.message
    details = error.details
  }
  // Handle Prisma errors
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409
        code = 'UNIQUE_CONSTRAINT_VIOLATION'
        message = 'A record with this information already exists'
        details = { field: error.meta?.target }
        break
      case 'P2025':
        statusCode = 404
        code = 'RECORD_NOT_FOUND'
        message = 'The requested record was not found'
        break
      case 'P2003':
        statusCode = 400
        code = 'FOREIGN_KEY_CONSTRAINT_VIOLATION'
        message = 'Invalid reference to related record'
        break
      case 'P2014':
        statusCode = 400
        code = 'INVALID_ID'
        message = 'The provided ID is invalid'
        break
      default:
        statusCode = 400
        code = 'DATABASE_ERROR'
        message = 'Database operation failed'
        details = { prismaCode: error.code }
    }
  }
  // Handle Prisma validation errors
  else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400
    code = 'VALIDATION_ERROR'
    message = 'Invalid data provided'
  }
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401
    code = 'INVALID_TOKEN'
    message = 'Invalid authentication token'
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401
    code = 'TOKEN_EXPIRED'
    message = 'Authentication token has expired'
  }
  // Handle validation errors
  else if (error.name === 'ValidationError') {
    statusCode = 400
    code = 'VALIDATION_ERROR'
    message = 'Validation failed'
  }
  // Handle syntax errors
  else if (error instanceof SyntaxError) {
    statusCode = 400
    code = 'INVALID_JSON'
    message = 'Invalid JSON in request body'
  }

  const errorResponse: APIError = {
    message,
    code,
    statusCode,
    details
  }

  // Don't expose sensitive error details in production
  if (process.env.NODE_ENV === 'production') {
    delete errorResponse.details
    if (statusCode === 500) {
      errorResponse.message = 'Internal server error'
    }
  }

  res.status(statusCode).json(errorResponse)
}

// Async error wrapper to catch async errors in route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Not found handler
export const notFoundHandler = (req: Request, res: Response) => {
  const errorResponse: APIError = {
    message: `Route ${req.originalUrl} not found`,
    code: 'ROUTE_NOT_FOUND',
    statusCode: 404
  }
  
  res.status(404).json(errorResponse)
}