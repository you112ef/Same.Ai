'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

interface Tool {
  id: string
  name: string
  description: string
  icon: string
  category: string
}

const tools: Tool[] = [
  {
    id: '1',
    name: 'React Components',
    description: 'Create reusable React components',
    icon: '⚛️',
    category: 'Frontend'
  },
  {
    id: '2', 
    name: 'API Endpoints',
    description: 'Build REST API endpoints',
    icon: '🔌',
    category: 'Backend'
  },
  {
    id: '3',
    name: 'Database Schema',
    description: 'Design database schemas',
    icon: '🗄️',
    category: 'Database'
  },
  {
    id: '4',
    name: 'Authentication',
    description: 'User authentication system',
    icon: '🔐',
    category: 'Security'
  }
]

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTool, setSelectedTool] = useState<string | null>(null)

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
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
            
            <button className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded text-gray-300 hover:bg-gray-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <span className="text-sm">Deploy</span>
            </button>
            
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              X
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
            />
            <svg className="w-4 h-4 text-gray-500 absolute right-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Tools List */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pb-4 space-y-2">
            {filteredTools.map((tool, index) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedTool === tool.id 
                    ? 'bg-gray-800 border-gray-600' 
                    : 'bg-gray-900 border-gray-800 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">{tool.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-300 font-medium">{index + 1}</span>
                      <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                    </div>
                    <h3 className="text-white font-medium text-sm mb-1">{tool.name}</h3>
                    <p className="text-gray-400 text-xs">{tool.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex justify-center">
            <div className="flex gap-4">
              <button className="w-6 h-6 text-gray-400 hover:text-white">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </button>
              <button className="w-6 h-6 text-gray-400 hover:text-white">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-900">
        {selectedTool ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p>Tool configuration interface would appear here</p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>Select a tool from the sidebar to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
