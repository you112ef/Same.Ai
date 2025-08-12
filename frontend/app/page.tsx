'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Paperclip, ArrowUp, ChevronDown, Copy, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { SameLogo } from '@/components/ui/same-logo'
import { ModelSelector } from '@/components/ui/model-selector'

export default function HomePage() {
  const [prompt, setPrompt] = useState('')
  const [selectedModel, setSelectedModel] = useState('claude-4-sonnet')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      // Redirect to chat with the prompt
      window.location.href = `/chat/new?prompt=${encodeURIComponent(prompt)}&model=${selectedModel}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <SameLogo className="w-6 h-6" />
                <span className="text-xl font-semibold text-gray-900">same</span>
              </div>
              <Button variant="ghost" size="sm" className="p-1">
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ExternalLink className="w-4 h-4 ml-1" />
                Careers
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                Docs
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                Log in
              </Button>
              <Button size="sm" className="bg-black text-white hover:bg-gray-800">
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        {/* Hero Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Make anything
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build fullstack web apps by prompting
          </p>
        </div>

        {/* Prompt Input */}
        <div className="w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Input Field */}
              <div className="flex items-start p-4 pb-16">
                <Button variant="ghost" size="sm" className="p-2 mr-2 text-gray-400">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="create a music streaming app with playlist sharing"
                  className="flex-1 border-0 text-lg placeholder:text-gray-400 focus-visible:ring-0"
                  style={{ 
                    fontSize: '18px',
                    background: 'transparent',
                    boxShadow: 'none'
                  }}
                />
              </div>

              {/* Bottom Bar */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-white border-t border-gray-100">
                {/* Model Selector */}
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                />

                {/* Submit Button */}
                <Button 
                  type="submit"
                  size="sm" 
                  className="bg-gray-900 text-white hover:bg-gray-800 rounded-full p-2"
                  disabled={!prompt.trim()}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Tab indicator */}
        <div className="mt-6 text-sm text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded">tab</span>
        </div>
      </main>
    </div>
  )
}
