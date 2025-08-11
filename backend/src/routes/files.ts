import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'
import { PrismaClient } from '@prisma/client'
import { asyncHandler, CustomError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'
import { FileType, PaginatedResponse } from '../../../shared/types'
import { validateFileSize, validateFileType, validatePaginationParams } from '../utils/validation'

const router = express.Router()
const prisma = new PrismaClient()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', (req as AuthRequest).user!.id)
    try {
      await fs.mkdir(uploadDir, { recursive: true })
      cb(null, uploadDir)
    } catch (error) {
      cb(error as Error, '')
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = path.extname(file.originalname)
    cb(null, `${uniqueSuffix}${extension}`)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per request
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = [
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      // Images
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      // Audio
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/mp4',
      // Video
      'video/mp4',
      'video/webm',
      'video/ogg',
      // Code files
      'text/javascript',
      'text/html',
      'text/css',
      'application/json',
      'application/xml'
    ]

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`))
    }
  }
})

// Get user files with pagination
router.get('/', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { page, limit } = validatePaginationParams(
    req.query.page as string,
    req.query.limit as string
  )
  
  const { type, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query
  const skip = (page - 1) * limit
  
  // Build where clause
  const where: any = {
    userId: req.user!.id
  }
  
  if (type) {
    where.type = type
  }
  
  if (search) {
    where.name = {
      contains: search as string,
      mode: 'insensitive'
    }
  }
  
  // Build orderBy clause
  const orderBy: any = {}
  orderBy[sortBy as string] = sortOrder
  
  try {
    const [files, total] = await Promise.all([
      prisma.file.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          name: true,
          type: true,
          mimeType: true,
          size: true,
          url: true,
          metadata: true,
          createdAt: true
        }
      }),
      prisma.file.count({ where })
    ])
    
    const response: PaginatedResponse<any> = {
      data: files,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1
      }
    }
    
    res.json(response)
  } catch (error) {
    console.error('Error fetching files:', error)
    throw new CustomError('Failed to fetch files', 500, 'FETCH_FILES_ERROR')
  }
}))

// Get specific file
router.get('/:id', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { id } = req.params
  
  const file = await prisma.file.findFirst({
    where: {
      id,
      userId: req.user!.id
    }
  })
  
  if (!file) {
    throw new CustomError('File not found', 404, 'FILE_NOT_FOUND')
  }
  
  res.json(file)
}))

// Upload files
router.post('/upload', upload.array('files', 5), asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const files = req.files as Express.Multer.File[]
  
  if (!files || files.length === 0) {
    throw new CustomError('No files provided', 400, 'NO_FILES')
  }
  
  const uploadedFiles = []
  
  try {
    for (const file of files) {
      // Determine file type
      const fileType = determineFileType(file.mimetype)
      
      // Generate file URL (in production, this would be a CDN URL)
      const fileUrl = `/uploads/${req.user!.id}/${file.filename}`
      
      // Save file record to database
      const fileRecord = await prisma.file.create({
        data: {
          name: file.originalname,
          type: fileType,
          mimeType: file.mimetype,
          size: file.size,
          url: fileUrl,
          userId: req.user!.id,
          metadata: {
            filename: file.filename,
            fieldname: file.fieldname,
            encoding: file.encoding
          }
        }
      })
      
      uploadedFiles.push(fileRecord)
    }
    
    res.status(201).json({
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
      files: uploadedFiles
    })
  } catch (error) {
    // Clean up uploaded files if database save fails
    for (const file of files) {
      try {
        await fs.unlink(file.path)
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError)
      }
    }
    
    console.error('Error uploading files:', error)
    throw new CustomError('Failed to upload files', 500, 'UPLOAD_ERROR')
  }
}))

// Download file
router.get('/:id/download', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { id } = req.params
  
  const file = await prisma.file.findFirst({
    where: {
      id,
      userId: req.user!.id
    }
  })
  
  if (!file) {
    throw new CustomError('File not found', 404, 'FILE_NOT_FOUND')
  }
  
  const filePath = path.join(process.cwd(), 'uploads', req.user!.id, file.metadata?.filename as string)
  
  try {
    await fs.access(filePath)
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`)
    res.setHeader('Content-Type', file.mimeType)
    res.sendFile(path.resolve(filePath))
  } catch (error) {
    throw new CustomError('File not found on disk', 404, 'FILE_NOT_FOUND_ON_DISK')
  }
}))

// Delete file
router.delete('/:id', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { id } = req.params
  
  const file = await prisma.file.findFirst({
    where: {
      id,
      userId: req.user!.id
    }
  })
  
  if (!file) {
    throw new CustomError('File not found', 404, 'FILE_NOT_FOUND')
  }
  
  try {
    // Delete file from disk
    const filePath = path.join(process.cwd(), 'uploads', req.user!.id, file.metadata?.filename as string)
    try {
      await fs.unlink(filePath)
    } catch (unlinkError) {
      console.warn('File not found on disk during deletion:', unlinkError)
    }
    
    // Delete file record from database
    await prisma.file.delete({
      where: { id }
    })
    
    res.json({ message: 'File deleted successfully' })
  } catch (error) {
    console.error('Error deleting file:', error)
    throw new CustomError('Failed to delete file', 500, 'DELETE_FILE_ERROR')
  }
}))

// Bulk delete files
router.post('/bulk-delete', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { fileIds } = req.body
  
  if (!fileIds || !Array.isArray(fileIds) || fileIds.length === 0) {
    throw new CustomError('File IDs array is required', 400, 'MISSING_FILE_IDS')
  }
  
  // Verify all files belong to the user
  const userFiles = await prisma.file.findMany({
    where: {
      id: { in: fileIds },
      userId: req.user!.id
    }
  })
  
  if (userFiles.length !== fileIds.length) {
    throw new CustomError('Some files not found or not accessible', 403, 'INVALID_FILE_ACCESS')
  }
  
  try {
    // Delete files from disk
    for (const file of userFiles) {
      const filePath = path.join(process.cwd(), 'uploads', req.user!.id, file.metadata?.filename as string)
      try {
        await fs.unlink(filePath)
      } catch (unlinkError) {
        console.warn('File not found on disk during bulk deletion:', unlinkError)
      }
    }
    
    // Delete file records from database
    const result = await prisma.file.deleteMany({
      where: {
        id: { in: fileIds },
        userId: req.user!.id
      }
    })
    
    res.json({
      message: `Successfully deleted ${result.count} files`,
      count: result.count
    })
  } catch (error) {
    console.error('Error in bulk delete:', error)
    throw new CustomError('Failed to delete files', 500, 'BULK_DELETE_ERROR')
  }
}))

// Get file stats
router.get('/stats/summary', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  try {
    const stats = await prisma.file.groupBy({
      by: ['type'],
      where: {
        userId: req.user!.id
      },
      _count: {
        id: true
      },
      _sum: {
        size: true
      }
    })
    
    const totalFiles = await prisma.file.count({
      where: {
        userId: req.user!.id
      }
    })
    
    const totalSize = await prisma.file.aggregate({
      where: {
        userId: req.user!.id
      },
      _sum: {
        size: true
      }
    })
    
    res.json({
      totalFiles,
      totalSize: totalSize._sum.size || 0,
      byType: stats.map(stat => ({
        type: stat.type,
        count: stat._count.id,
        size: stat._sum.size || 0
      }))
    })
  } catch (error) {
    console.error('Error fetching file stats:', error)
    throw new CustomError('Failed to fetch file statistics', 500, 'FETCH_STATS_ERROR')
  }
}))

// Helper function to determine file type
function determineFileType(mimeType: string): FileType {
  if (mimeType.startsWith('image/')) {
    return FileType.IMAGE
  } else if (mimeType.startsWith('audio/')) {
    return FileType.AUDIO
  } else if (mimeType.startsWith('video/')) {
    return FileType.VIDEO
  } else if (
    mimeType.includes('pdf') ||
    mimeType.includes('word') ||
    mimeType.includes('excel') ||
    mimeType.includes('powerpoint') ||
    mimeType.includes('text') ||
    mimeType.includes('document')
  ) {
    return FileType.DOCUMENT
  } else {
    return FileType.OTHER
  }
}

export default router