'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

interface DeploymentStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  duration?: string
}

export default function DeployPage() {
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    { id: '1', name: 'Building application', status: 'pending' },
    { id: '2', name: 'Installing dependencies', status: 'pending' },
    { id: '3', name: 'Running tests', status: 'pending' },
    { id: '4', name: 'Creating production build', status: 'pending' },
    { id: '5', name: 'Deploying to server', status: 'pending' },
    { id: '6', name: 'Setting up domain', status: 'pending' }
  ])
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null)

  const startDeployment = () => {
    setIsDeploying(true)
    setDeploymentUrl(null)
    
    // Reset all steps
    setDeploymentSteps(steps => 
      steps.map(step => ({ ...step, status: 'pending' as const }))
    )

    // Simulate deployment process
    let currentStepIndex = 0
    const interval = setInterval(() => {
      if (currentStepIndex < deploymentSteps.length) {
        setDeploymentSteps(steps => 
          steps.map((step, index) => {
            if (index === currentStepIndex) {
              return { ...step, status: 'running' as const }
            } else if (index < currentStepIndex) {
              return { ...step, status: 'completed' as const, duration: '2.3s' }
            }
            return step
          })
        )

        setTimeout(() => {
          setDeploymentSteps(steps => 
            steps.map((step, index) => {
              if (index === currentStepIndex) {
                return { ...step, status: 'completed' as const, duration: '2.3s' }
              }
              return step
            })
          )
          currentStepIndex++
          
          if (currentStepIndex >= deploymentSteps.length) {
            clearInterval(interval)
            setIsDeploying(false)
            setDeploymentUrl('https://same-project-abc123.vercel.app')
          }
        }, 2000)
      }
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </button>
          
          <button className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          
          <div className="text-gray-400">•••</div>
          
          <button className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          
          <div className="bg-orange-600 text-white text-xs px-2 py-1 rounded font-medium">
            Pro
          </div>
          
          <button className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <span className="text-gray-300">Tools</span>
          
          <button className="flex items-center gap-2 bg-blue-600 px-3 py-1.5 rounded text-white font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <span className="text-sm">Deploy</span>
          </button>
          
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
            X
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Deploy Your Project</h1>
            <p className="text-gray-400">
              Deploy your application to the cloud with one click
            </p>
          </div>

          {/* Deployment Status */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Deployment Status</h2>
              {!isDeploying && !deploymentUrl && (
                <Button 
                  onClick={startDeployment}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Start Deployment
                </Button>
              )}
            </div>

            {/* Deployment Steps */}
            <div className="space-y-4">
              {deploymentSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {step.status === 'completed' ? (
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : step.status === 'running' ? (
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : step.status === 'failed' ? (
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-sm text-gray-300">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        step.status === 'completed' ? 'text-green-400' :
                        step.status === 'running' ? 'text-blue-400' :
                        step.status === 'failed' ? 'text-red-400' :
                        'text-gray-400'
                      }`}>
                        {step.name}
                      </span>
                      {step.duration && (
                        <span className="text-sm text-gray-500">{step.duration}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deployment Result */}
          {deploymentUrl && (
            <div className="bg-green-900 border border-green-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-400">Deployment Successful!</h3>
              </div>
              
              <p className="text-green-300 mb-4">
                Your application has been successfully deployed and is now live.
              </p>
              
              <div className="flex items-center gap-4">
                <a 
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Visit Site
                </a>
                
                <button 
                  onClick={() => navigator.clipboard.writeText(deploymentUrl)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Copy URL
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-gray-800 rounded border">
                <code className="text-sm text-gray-300">{deploymentUrl}</code>
              </div>
            </div>
          )}

          {/* Deployment Settings */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Deployment Settings</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Name
                </label>
                <input 
                  type="text"
                  defaultValue="same-project"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Domain
                </label>
                <input 
                  type="text"
                  placeholder="your-domain.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Environment
                </label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600">
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Provider
                </label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-600">
                  <option value="vercel">Vercel</option>
                  <option value="netlify">Netlify</option>
                  <option value="aws">AWS</option>
                  <option value="gcp">Google Cloud</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
