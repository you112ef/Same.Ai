'use client'

import { useState, useEffect, useRef } from 'react'

interface TerminalLine {
  id: string
  type: 'command' | 'output' | 'error'
  text: string
  timestamp: Date
}

export default function TerminalPage() {
  const [input, setInput] = useState('')
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      text: 'Welcome to Same Terminal',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'output',
      text: 'Type "help" for available commands',
      timestamp: new Date()
    }
  ])
  const [currentDirectory, setCurrentDirectory] = useState('~')
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const addLine = (type: TerminalLine['type'], text: string) => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date()
    }
    setLines(prev => [...prev, newLine])
  }

  const executeCommand = (command: string) => {
    // Add command to history
    addLine('command', `$ ${command}`)

    // Simple command simulation
    switch (command.toLowerCase().trim()) {
      case 'help':
        addLine('output', 'Available commands:')
        addLine('output', '  ls       - List files')
        addLine('output', '  pwd      - Print working directory')
        addLine('output', '  cd       - Change directory')
        addLine('output', '  clear    - Clear terminal')
        addLine('output', '  npm run  - Run npm commands')
        addLine('output', '  git      - Git commands')
        break
      
      case 'ls':
        addLine('output', 'src/          package.json  README.md')
        addLine('output', 'public/       tsconfig.json node_modules/')
        addLine('output', 'components/   .env.local    .gitignore')
        break
      
      case 'pwd':
        addLine('output', '/Users/developer/same-project')
        break
      
      case 'clear':
        setLines([])
        break
      
      case '':
        // Empty command, just show prompt
        break
      
      default:
        if (command.startsWith('cd ')) {
          const dir = command.substring(3).trim()
          setCurrentDirectory(dir || '~')
          addLine('output', '')
        } else if (command.startsWith('npm ')) {
          addLine('output', `Running: ${command}`)
          addLine('output', '✓ Command executed successfully')
        } else if (command.startsWith('git ')) {
          addLine('output', `Git: ${command}`)
          addLine('output', '✓ Git command completed')
        } else {
          addLine('error', `Command not found: ${command}`)
        }
        break
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      executeCommand(input)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      // Could implement command history here
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

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
      </header>

      {/* Terminal Content */}
      <div className="flex-1 flex flex-col">
        {/* Terminal Header */}
        <div className="bg-gray-900 px-6 py-3 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">bash</h1>
            <button className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-gray-300 hover:bg-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Terminal Output */}
        <div 
          ref={terminalRef}
          className="flex-1 p-4 overflow-y-auto font-mono text-sm"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="space-y-1">
            {lines.map(line => (
              <div key={line.id} className="flex">
                <span className={`${
                  line.type === 'command' 
                    ? 'text-green-400' 
                    : line.type === 'error' 
                    ? 'text-red-400' 
                    : 'text-gray-300'
                }`}>
                  {line.text}
                </span>
              </div>
            ))}
          </div>

          {/* Current Input Line */}
          <form onSubmit={handleSubmit} className="flex mt-2">
            <span className="text-green-400 mr-2">
              {currentDirectory}$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono"
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </div>
      </div>
    </div>
  )
}
