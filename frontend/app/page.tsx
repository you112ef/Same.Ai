'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Paperclip, ArrowUp, ChevronDown, Copy, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [prompt, setPrompt] = useState('make a customer support ticket system with live chat')
  const [selectedModel, setSelectedModel] = useState('claude-4-sonnet')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      // Redirect to chat with the prompt
      window.location.href = `/chat/new?prompt=${encodeURIComponent(prompt)}&model=${selectedModel}`
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full">
        <div className="max-w-none px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 text-black">
                  {/* Same logo - grid pattern */}
                  <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
                    <rect x="2" y="2" width="6" height="6" rx="1"/>
                    <rect x="10" y="2" width="6" height="6" rx="1"/>
                    <rect x="18" y="2" width="4" height="6" rx="1"/>
                    <rect x="2" y="10" width="6" height="6" rx="1"/>
                    <rect x="10" y="10" width="6" height="6" rx="1"/>
                    <rect x="18" y="10" width="4" height="6" rx="1"/>
                    <rect x="2" y="18" width="6" height="4" rx="1"/>
                    <rect x="10" y="18" width="6" height="4" rx="1"/>
                    <rect x="18" y="18" width="4" height="4" rx="1"/>
                  </svg>
                </div>
                <span className="text-xl font-semibold text-black">same</span>
              </div>
              <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100">
                <Copy className="w-4 h-4 text-gray-600" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-6">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-black">
                <ExternalLink className="w-4 h-4 mr-1" />
                Careers
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-black">
                Docs
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-black">
                Log in
              </Button>
              <Button 
                size="sm" 
                className="bg-black text-white hover:bg-gray-900 px-4 py-2 rounded-md"
              >
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        {/* Hero Title */}
        <div className="text-center mb-16 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold text-black mb-6 leading-tight">
            Make anything
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
            Build fullstack web apps by prompting
          </p>
        </div>

        {/* Prompt Input */}
        <div className="w-full max-w-2xl mb-8">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative bg-gray-100 rounded-2xl border-0 shadow-sm overflow-hidden">
              {/* Input Field */}
              <div className="flex items-start p-6 pb-20">
                <Button variant="ghost" size="sm" className="p-2 mr-3 text-gray-400 hover:text-gray-600">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="make a customer support ticket system with live chat"
                  className="flex-1 border-0 bg-transparent text-lg placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                  style={{ 
                    fontSize: '18px',
                    background: 'transparent',
                    boxShadow: 'none',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Bottom Bar */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-6 bg-gray-100">
                {/* Model Selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    {selectedModel}
                  </span>
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-200">
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  size="sm" 
                  className="bg-black text-white hover:bg-gray-900 rounded-full p-3"
                  disabled={!prompt.trim()}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Tab indicator */}
        <div className="text-sm text-gray-500">
          <span className="bg-gray-200 px-3 py-1 rounded text-xs font-medium">tab</span>
        </div>
      </main>
    </div>
  )
}
