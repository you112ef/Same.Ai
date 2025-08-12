'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

interface MCPServer {
  id: string
  name: string
  description: string
  icon: string
  installed: boolean
  category: string
}

const mcpServers: MCPServer[] = [
  {
    id: 'custom',
    name: 'Custom MCP',
    description: 'Any MCP server. Supports studio, Streamable HTTP, and SSE transports.',
    icon: '🔗',
    installed: false,
    category: 'custom'
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Version control and collaborative development platform',
    icon: '🐙',
    installed: false,
    category: 'development'
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Serverless Postgres database',
    icon: '🗄️',
    installed: false,
    category: 'database'
  },
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'Open source Firebase alternative',
    icon: '⚡',
    installed: false,
    category: 'backend'
  },
  {
    id: 'netlify',
    name: 'Netlify',
    description: 'Deploy and scale your web applications',
    icon: '🌐',
    installed: false,
    category: 'deployment'
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Design to code conversion',
    icon: '🎨',
    installed: false,
    category: 'design'
  }
]

export default function MCPToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showDialog, setShowDialog] = useState(false)
  const [selectedServer, setSelectedServer] = useState<MCPServer | null>(null)

  const categories = ['all', 'custom', 'development', 'database', 'backend', 'deployment', 'design']

  const filteredServers = selectedCategory === 'all' 
    ? mcpServers 
    : mcpServers.filter(server => server.category === selectedCategory)

  const handleAddServer = (server: MCPServer) => {
    setSelectedServer(server)
    setShowDialog(true)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Overlay Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">MCP Tools</h2>
              <button 
                onClick={() => setShowDialog(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-400 mb-6">
              Explore and install MCP servers to extend Same's capabilities
            </p>

            <div className="space-y-4">
              {/* Custom MCP Card */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-xl">
                    🔗
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">Custom MCP</h3>
                    <p className="text-gray-400 text-sm">
                      Any MCP server. Supports studio, Streamable HTTP, and SSE transports.
                    </p>
                  </div>
                </div>
                <Button 
                  className="w-full bg-white text-black hover:bg-gray-100 font-medium"
                  onClick={() => console.log('Add Custom MCP')}
                >
                  + Add Custom MCP
                </Button>
              </div>

              {/* GitHub Card */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-xl">
                    🐙
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">GitHub</h3>
                    <p className="text-gray-400 text-sm">
                      Version control and collaborative development platform
                    </p>
                  </div>
                </div>
                <Button 
                  className="w-full bg-white text-black hover:bg-gray-100 font-medium"
                  onClick={() => console.log('Add GitHub')}
                >
                  + Add GitHub
                </Button>
              </div>

              {/* Neon Card */}
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-xl">
                    🗄️
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">Neon</h3>
                    <p className="text-gray-400 text-sm">
                      Serverless Postgres database
                    </p>
                  </div>
                </div>
                <Button 
                  className="w-full bg-white text-black hover:bg-gray-100 font-medium"
                  onClick={() => console.log('Add Neon')}
                >
                  + Add Neon
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">MCP Tools</h1>
              <p className="text-gray-400">
                Explore and install MCP servers to extend Same's capabilities
              </p>
            </div>
            <Button 
              onClick={() => setShowDialog(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Open MCP Dialog
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* MCP Servers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServers.map(server => (
              <div 
                key={server.id}
                className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-xl">
                    {server.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{server.name}</h3>
                    <p className="text-gray-400 text-sm">{server.description}</p>
                  </div>
                </div>
                
                {server.installed ? (
                  <Button 
                    variant="outline" 
                    className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                    disabled
                  >
                    ✓ Installed
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleAddServer(server)}
                    className="w-full bg-white text-black hover:bg-gray-100 font-medium"
                  >
                    + Add {server.name}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
