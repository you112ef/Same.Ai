'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!url) return
    
    setIsLoading(true)
    try {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 2000))
      setPreview('https://via.placeholder.com/800x600?text=Generated+Clone')
    } catch (error) {
      console.error('Error generating clone:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">same</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Docs</a>
            <Button variant="outline" size="sm">Sign In</Button>
            <Button size="sm">Get Started</Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Clone any website
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Enter any URL and get a pixel-perfect clone with production-ready code in seconds. 
            Perfect for inspiration, rapid prototyping, and learning.
          </p>
        </div>

        {/* URL Input Section */}
        <Card className="p-8 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12 text-lg"
              />
            </div>
            <Button 
              onClick={handleGenerate}
              disabled={!url || isLoading}
              className="h-12 px-8 text-lg font-medium"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Cloning...
                </div>
              ) : (
                'Clone Website'
              )}
            </Button>
          </div>
        </Card>

        {/* Preview Section */}
        {preview && (
          <Card className="p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Download Code</Button>
                <Button variant="outline" size="sm">Export Image</Button>
                <Button size="sm">Open in Editor</Button>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 text-sm text-gray-600">
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <span className="ml-2">{url}</span>
              </div>
              <div className="bg-white">
                <img 
                  src={preview} 
                  alt="Website clone preview" 
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Generate pixel-perfect clones in seconds, not hours.</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pixel Perfect</h3>
            <p className="text-gray-600">Accurate layouts, colors, and spacing reproduction.</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Clean Code</h3>
            <p className="text-gray-600">Production-ready React, HTML, and CSS code output.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600">
          <p>&copy; 2024 Same. Built with AI for developers and designers.</p>
        </div>
      </footer>
    </div>
  )
}
