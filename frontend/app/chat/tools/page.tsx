'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import ReactComponentsPanel from './panels/ReactComponentsPanel'
import APIEndpointsPanel from './panels/APIEndpointsPanel'
import DatabaseSchemaPanel from './panels/DatabaseSchemaPanel'
import AuthenticationPanel from './panels/AuthenticationPanel'
import DeploymentPanel from './panels/DeploymentPanel'
import MonitoringPanel from './panels/MonitoringPanel'
import TestingPanel from './panels/TestingPanel'
import PerformancePanel from './panels/PerformancePanel'

interface Tool {
  id: string
  name: string
  description: string
  icon: string
  category: string
  status: 'active' | 'inactive' | 'pending'
  lastUsed?: Date
}

const tools: Tool[] = [
  {
    id: 'react-components',
    name: 'React Components',
    description: 'Create and manage reusable React components',
    icon: '⚛️',
    category: 'Frontend',
    status: 'active',
    lastUsed: new Date()
  },
  {
    id: 'api-endpoints',
    name: 'API Endpoints',
    description: 'Build and test REST API endpoints',
    icon: '🔌',
    category: 'Backend',
    status: 'active'
  },
  {
    id: 'database-schema',
    name: 'Database Schema',
    description: 'Design and migrate database schemas',
    icon: '🗄️',
    category: 'Database',
    status: 'active'
  },
  {
    id: 'authentication',
    name: 'Authentication',
    description: 'User authentication and authorization',
    icon: '🔐',
    category: 'Security',
    status: 'active'
  },
  {
    id: 'deployment',
    name: 'Deployment',
    description: 'Deploy and manage applications',
    icon: '🚀',
    category: 'DevOps',
    status: 'active'
  },
  {
    id: 'monitoring',
    name: 'Monitoring',
    description: 'Application monitoring and analytics',
    icon: '📊',
    category: 'Analytics',
    status: 'pending'
  },
  {
    id: 'testing',
    name: 'Testing',
    description: 'Automated testing and quality assurance',
    icon: '🧪',
    category: 'Quality',
    status: 'inactive'
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Performance optimization tools',
    icon: '⚡',
    category: 'Optimization',
    status: 'pending'
  }
]

const categories = ['All', 'Frontend', 'Backend', 'Database', 'Security', 'DevOps', 'Analytics', 'Quality', 'Optimization']

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isLoading, setIsLoading] = useState(false)

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'inactive': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const renderToolPanel = () => {
    switch (selectedTool) {
      case 'react-components':
        return <ReactComponentsPanel />
      case 'api-endpoints':
        return <APIEndpointsPanel />
      case 'database-schema':
        return <DatabaseSchemaPanel />
      case 'authentication':
        return <AuthenticationPanel />
      case 'deployment':
        return <DeploymentPanel />
      case 'monitoring':
        return <MonitoringPanel />
      case 'testing':
        return <TestingPanel />
      case 'performance':
        return <PerformancePanel />
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400 max-w-md">
              <svg className="w-20 h-20 mx-auto mb-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
              </svg>
              <h3 className="text-lg font-medium text-gray-300 mb-2">Select a Tool</h3>
              <p className="text-sm">Choose a development tool from the sidebar to get started building your application.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Enhanced Sidebar */}
      <div className="w-80 border-r border-gray-800 flex flex-col bg-gray-950">
        {/* Header with Navigation */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Active Session</span>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2 mb-4">
            <Button size="sm" variant="outline" className="flex-1 text-xs">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-xs">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 space-y-4">
          <div className="relative">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="pl-9 bg-gray-900 border-gray-700 text-white placeholder-gray-500"
            />
            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tools List */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pb-4 space-y-2">
            {filteredTools.map((tool, index) => (
              <Card
                key={tool.id}
                className={`p-3 cursor-pointer transition-all duration-200 border ${
                  selectedTool === tool.id 
                    ? 'bg-gray-800 border-blue-500 shadow-md' 
                    : 'bg-gray-900 border-gray-800 hover:bg-gray-800 hover:border-gray-700'
                }`}
                onClick={() => setSelectedTool(tool.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-lg flex-shrink-0">{tool.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(tool.status)}`}></div>
                      <span className="text-gray-400 text-xs font-medium">#{index + 1}</span>
                    </div>
                    <h3 className="text-white font-medium text-sm mb-1 truncate">{tool.name}</h3>
                    <p className="text-gray-400 text-xs leading-tight">{tool.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs px-2 py-0.5 bg-gray-800 rounded text-gray-300">
                        {tool.category}
                      </span>
                      {tool.lastUsed && (
                        <span className="text-xs text-gray-500">
                          Just now
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400">Quick Actions</span>
            <span className="text-xs text-gray-500">{filteredTools.length} tools</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="text-xs">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Export
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content Area */}
      <div className="flex-1 bg-gray-900 flex flex-col">
        {/* Top Bar */}
        {selectedTool && (
          <div className="border-b border-gray-800 bg-gray-950 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {tools.find(t => t.id === selectedTool)?.icon}
                </span>
                <div>
                  <h1 className="text-lg font-semibold text-white">
                    {tools.find(t => t.id === selectedTool)?.name}
                  </h1>
                  <p className="text-sm text-gray-400">
                    {tools.find(t => t.id === selectedTool)?.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share
                </Button>
                <Button size="sm">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Generate
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tool Content */}
        <div className="flex-1 overflow-hidden">
          {renderToolPanel()}
        </div>
      </div>
    </div>
  )
}
