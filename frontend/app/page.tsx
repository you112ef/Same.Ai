'use client'

import { useState } from 'react'

export default function HomePage() {
  const [prompt, setPrompt] = useState('make a collaborative whiteboard app wit...')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      window.location.href = `/chat/new?prompt=${encodeURIComponent(prompt)}`
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        {/* Logo - Exact match from reference image */}
        <div className="flex items-center gap-3">
          {/* Complex logo icon like in the reference */}
          <div className="relative w-8 h-6">
            {/* Main rectangles */}
            <div className="absolute top-0 left-0 w-3 h-2 bg-white rounded-sm"></div>
            <div className="absolute top-0 right-0 w-3 h-2 bg-white rounded-sm"></div>
            <div className="absolute bottom-0 left-0 w-3 h-2 bg-white rounded-sm"></div>
            <div className="absolute bottom-0 right-0 w-3 h-2 bg-white rounded-sm"></div>
            {/* Connecting elements */}
            <div className="absolute top-0.5 left-2.5 w-3 h-0.5 bg-white"></div>
            <div className="absolute bottom-0.5 left-2.5 w-3 h-0.5 bg-white"></div>
          </div>
          <span className="text-2xl font-medium">same</span>
        </div>
        
        {/* Header Icons - Exact match from reference */}
        <div className="flex items-center gap-6">
          {/* Monitor Icon */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </button>
          
          {/* Database/Server Icon */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="m3 5 0 14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
              <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
            </svg>
          </button>
          
          {/* Document Stack Icon */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </button>
          
          {/* Grid/Layout Icon */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="15" x2="21" y2="15"/>
              <line x1="3" y1="9" x2="5" y2="9"/>
              <line x1="3" y1="15" x2="5" y2="15"/>
            </svg>
          </button>
          
          {/* User Avatar - Blue circle with X */}
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
            X
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-8" style={{minHeight: 'calc(100vh - 120px)'}}>
        <div className="w-full max-w-4xl text-center">
          {/* Main Title Section */}
          <div className="mb-16">
            <h1 className="text-8xl font-bold tracking-tight leading-none mb-6 text-white">
              Make anything
            </h1>
            <p className="text-2xl text-gray-400 font-normal">
              Build fullstack web apps by prompting
            </p>
          </div>

          {/* Input Form Section */}
          <div className="w-full max-w-3xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="relative bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-3xl border border-gray-700 p-2 shadow-2xl">
                <div className="flex items-center">
                  {/* Attachment Icon */}
                  <button
                    type="button"
                    className="flex items-center justify-center w-14 h-14 text-gray-400 hover:text-white transition-colors rounded-2xl hover:bg-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"/>
                    </svg>
                  </button>
                  
                  {/* Input Field */}
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="make a collaborative whiteboard app wit..."
                    className="flex-1 bg-transparent text-white placeholder-gray-500 text-lg py-4 px-4 border-none outline-none font-normal"
                  />
                  
                  {/* Right Section */}
                  <div className="flex items-center gap-4 pr-3">
                    {/* Model Badge */}
                    <div className="flex items-center gap-2 bg-gray-700 rounded-xl px-4 py-2 text-sm">
                      <span className="text-gray-200 font-medium">Agentic</span>
                      <span className="bg-gray-600 px-2 py-1 rounded-md text-xs text-gray-300 font-medium">max</span>
                    </div>
                    
                    {/* Send Button */}
                    <button
                      type="submit"
                      className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
