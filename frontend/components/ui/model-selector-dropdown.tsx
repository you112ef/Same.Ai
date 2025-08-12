'use client'

import { useState, useRef, useEffect } from 'react'

interface ModelOption {
  id: string
  name: string
  description: string
  icon: string
  provider: string
  features: string[]
  speed: number // 1-5
  quality: number // 1-5
  cost: 'low' | 'medium' | 'high'
}

const modelOptions: ModelOption[] = [
  {
    id: 'claude-4-sonnet',
    name: 'Claude 4 Sonnet',
    description: 'متوازن وسريع، مثالي للمشاريع العامة',
    icon: '🤖',
    provider: 'Anthropic',
    features: ['نصوص طويلة', 'تحليل الكود', 'إبداع'],
    speed: 4,
    quality: 4,
    cost: 'medium'
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'قوي ومتطور�� الأفضل للمهام المعقدة',
    icon: '⚡',
    provider: 'OpenAI',
    features: ['تحليل عميق', 'منطق', 'إبداع متقدم'],
    speed: 3,
    quality: 5,
    cost: 'high'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'متعدد الوسائط، يدعم النصوص والصور',
    icon: '✨',
    provider: 'Google',
    features: ['متعدد الوسائط', 'سريع', 'فعال'],
    speed: 5,
    quality: 4,
    cost: 'low'
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'سريع وفعال من حيث التكلفة',
    icon: '🐰',
    provider: 'Anthropic',
    features: ['سرعة عالية', 'توفير', 'بساطة'],
    speed: 5,
    quality: 3,
    cost: 'low'
  },
  {
    id: 'llama-3',
    name: 'Llama 3',
    description: 'مفتوح المصدر، موثوق وآمن',
    icon: '🦙',
    provider: 'Meta',
    features: ['مفتوح المصدر', 'خصوصية', 'شفافية'],
    speed: 3,
    quality: 4,
    cost: 'low'
  }
]

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
  disabled?: boolean
}

export function ModelSelectorDropdown({ selectedModel, onModelChange, disabled = false }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const selectedModelData = modelOptions.find(model => model.id === selectedModel) || modelOptions[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getCostText = (cost: string) => {
    switch (cost) {
      case 'low': return 'منخفضة'
      case 'medium': return 'متوسطة'
      case 'high': return 'عالية'
      default: return 'غير محدد'
    }
  }

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={star <= count ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className={star <= count ? "text-yellow-400" : "text-gray-300"}
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
          </svg>
        ))}
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors min-w-[280px] ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <span className="text-lg">{selectedModelData.icon}</span>
        <div className="flex-1 text-right">
          <div className="font-medium text-gray-900">{selectedModelData.name}</div>
          <div className="text-sm text-gray-600">{selectedModelData.provider}</div>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-2">
            {modelOptions.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id)
                  setIsOpen(false)
                }}
                className={`w-full p-4 rounded-lg text-right hover:bg-gray-50 transition-colors ${
                  selectedModel === model.id ? 'bg-blue-50 border border-blue-200' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-1">{model.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{model.name}</h3>
                        <p className="text-sm text-gray-600">{model.provider}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCostColor(model.cost)}`}>
                        {getCostText(model.cost)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {model.description}
                    </p>
                    
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>السرعة</span>
                          {renderStars(model.speed)}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>الجودة</span>
                          {renderStars(model.quality)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {model.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="border-t border-gray-100 p-4 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              <p>💡 تلميح: يمكنك التبديل بين النماذج أثناء المحادثة</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
