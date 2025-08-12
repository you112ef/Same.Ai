import express from 'express'
import { AppGeneratorService } from '../services/appGeneratorService'
import { asyncHandler, CustomError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'

const router = express.Router()
const appGenerator = new AppGeneratorService()

// Generate new app
router.post('/generate', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { prompt, model = 'claude-4-sonnet' } = req.body

  if (!prompt || prompt.trim().length === 0) {
    throw new CustomError('Prompt is required', 400, 'MISSING_PROMPT')
  }

  if (prompt.length > 1000) {
    throw new CustomError('Prompt too long (max 1000 characters)', 400, 'PROMPT_TOO_LONG')
  }

  try {
    const generatedApp = await appGenerator.generateApp(prompt, model)
    
    res.json({
      success: true,
      app: generatedApp,
      message: 'App generated successfully'
    })
  } catch (error) {
    console.error('App generation failed:', error)
    throw new CustomError('Failed to generate app', 500, 'GENERATION_FAILED')
  }
}))

// Get app details
router.get('/apps/:appId', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { appId } = req.params
  
  const app = await appGenerator.getApp(appId)
  if (!app) {
    throw new CustomError('App not found', 404, 'APP_NOT_FOUND')
  }
  
  res.json({
    success: true,
    app
  })
}))

// List all apps
router.get('/apps', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const apps = await appGenerator.listApps()
  
  res.json({
    success: true,
    apps,
    count: apps.length
  })
}))

// Update app
router.put('/apps/:appId', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { appId } = req.params
  const { files, name, description } = req.body
  
  // Implementation for updating app files
  res.json({
    success: true,
    message: 'App updated successfully'
  })
}))

// Delete app
router.delete('/apps/:appId', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { appId } = req.params
  
  // Implementation for deleting app
  res.json({
    success: true,
    message: 'App deleted successfully'
  })
}))

// Download app as zip
router.get('/apps/:appId/download', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { appId } = req.params
  
  // Implementation for creating and sending zip file
  res.json({
    success: true,
    download_url: `/downloads/${appId}.zip`
  })
}))

// Deploy app
router.post('/apps/:appId/deploy', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { appId } = req.params
  const { platform = 'vercel' } = req.body
  
  // Implementation for deploying to various platforms
  res.json({
    success: true,
    deployment_url: `https://${appId}.vercel.app`,
    platform
  })
}))

export default router
