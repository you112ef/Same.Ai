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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        {/* Logo - Exact same.new style */}
        <div className="flex items-center gap-3">
          {/* Grid Logo */}
          <div className="flex gap-1">
            <div className="flex flex-col gap-1">
              <div className="w-2 h-2 bg-white"></div>
              <div className="w-2 h-2 bg-white"></div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-2 h-2 bg-white"></div>
              <div className="w-2 h-2 bg-white"></div>
            </div>
          </div>
          <span className="text-xl font-medium ml-1">same</span>
        </div>
        
        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          {/* Monitor Icon */}
          <button className="text-gray-400 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"/>
            </svg>
          </button>
          
          {/* Database Icon */}
          <button className="text-gray-400 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"/>
            </svg>
          </button>
          
          {/* Document Icon */}
          <button className="text-gray-400 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
            </svg>
          </button>
          
          {/* Layout Icon */}
          <button className="text-gray-400 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
            </svg>
          </button>
          
          {/* User Avatar */}
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
            X
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-8">
        <div className="w-full max-w-4xl text-center space-y-16">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-7xl lg:text-8xl font-bold tracking-tight leading-none">
              Make anything
            </h1>
            <p className="text-xl text-gray-400 font-normal">
              Build fullstack web apps by prompting
            </p>
          </div>

          {/* Input Section */}
          <div className="w-full max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-2xl border border-gray-700 p-1 shadow-2xl">
                <div className="flex items-center gap-2">
                  {/* Attachment Button */}
                  <button
                    type="button"
                    className="flex items-center justify-center w-12 h-12 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"/>
                    </svg>
                  </button>
                  
                  {/* Text Input */}
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="make a collaborative whiteboard app wit..."
                    className="flex-1 bg-transparent text-white placeholder-gray-500 text-lg py-3 px-2 border-none outline-none"
                  />
                  
                  {/* Right Controls */}
                  <div className="flex items-center gap-3 pr-2">
                    {/* Model Selector */}
                    <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2 text-sm">
                      <span className="text-gray-200 font-medium">Agentic</span>
                      <span className="bg-gray-600 px-2 py-0.5 rounded text-xs text-gray-300">max</span>
                    </div>
                    
                    {/* Send Button */}
                    <button
                      type="submit"
                      className="flex items-center justify-center w-10 h-10 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
