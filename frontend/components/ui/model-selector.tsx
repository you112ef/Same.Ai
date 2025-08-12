'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, Check } from 'lucide-react'

const models = [
  { id: 'claude-3.5-sonnet', name: 'claude-3.5-sonnet', provider: 'Anthropic' },
  { id: 'claude-3-opus', name: 'claude-3-opus', provider: 'Anthropic' },
  { id: 'claude-3-haiku', name: 'claude-3-haiku', provider: 'Anthropic' },
  { id: 'gpt-4', name: 'gpt-4', provider: 'OpenAI' },
  { id: 'gpt-3.5-turbo', name: 'gpt-3.5-turbo', provider: 'OpenAI' },
  { id: 'gemini-pro', name: 'gemini-pro', provider: 'Google' },
]

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedModelData = models.find(m => m.id === selectedModel) || models[0]

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm font-medium text-gray-700"
      >
        <span>{selectedModelData.name}</span>
        <ChevronDown className="w-4 h-4" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute bottom-full left-0 mb-2 z-20 bg-white border border-gray-200 rounded-lg shadow-lg min-w-48">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-1">
                Select Model
              </div>
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 text-sm rounded hover:bg-gray-50 text-left"
                >
                  <div>
                    <div className="font-medium text-gray-900">{model.name}</div>
                    <div className="text-xs text-gray-500">{model.provider}</div>
                  </div>
                  {selectedModel === model.id && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
