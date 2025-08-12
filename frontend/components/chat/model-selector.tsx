'use client'

import { useState } from 'react'
import { AIModel, MODEL_CONFIGS } from '../../../../shared/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  ChevronDown, 
  Sparkles, 
  Zap, 
  Brain,
  Eye,
  Check,
  Clock,
  DollarSign
} from 'lucide-react'

interface ModelSelectorProps {
  selectedModel: AIModel
  onModelChange: (model: AIModel) => void
  disabled?: boolean
}

const modelIcons = {
  [AIModel.GPT4]: Sparkles,
  [AIModel.GPT35]: Zap,
  [AIModel.CLAUDE3_OPUS]: Brain,
  [AIModel.CLAUDE3_SONNET]: Brain,
  [AIModel.CLAUDE3_HAIKU]: Brain,
  [AIModel.GEMINI_PRO]: Eye,
  [AIModel.GEMINI_ULTRA]: Eye,
  [AIModel.LLAMA2]: Sparkles,
  [AIModel.LLAMA3]: Sparkles
}

const modelColors = {
  openai: 'from-green-500 to-green-600',
  anthropic: 'from-orange-500 to-red-600',
  google: 'from-blue-500 to-blue-600',
  meta: 'from-purple-500 to-pink-600'
}

export function ModelSelector({ selectedModel, onModelChange, disabled }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedConfig = MODEL_CONFIGS[selectedModel]
  const SelectedIcon = modelIcons[selectedModel]

  const groupedModels = Object.entries(MODEL_CONFIGS).reduce((acc, [model, config]) => {
    if (!acc[config.provider]) {
      acc[config.provider] = []
    }
    acc[config.provider].push({ model: model as AIModel, config })
    return acc
  }, {} as Record<string, Array<{ model: AIModel, config: typeof MODEL_CONFIGS[AIModel] }>>)

  const handleModelSelect = (model: AIModel) => {
    onModelChange(model)
    setIsOpen(false)
  }

  const getSpeedIndicator = (provider: string) => {
    const speeds = {
      openai: 'سريع',
      anthropic: 'متوسط',
      google: 'سريع جداً',
      meta: 'سريع'
    }
    return speeds[provider as keyof typeof speeds] || 'متوسط'
  }

  const getCostIndicator = (cost: number) => {
    if (cost <= 0.001) return { level: 'منخفض', color: 'text-green-600' }
    if (cost <= 0.01) return { level: 'متوسط', color: 'text-yellow-600' }
    return { level: 'مرتفع', color: 'text-red-600' }
  }

  return (
    <div className="relative">
      {/* Selected model display */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-auto gap-2 justify-between min-w-[200px]"
      >
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${modelColors[selectedConfig.provider]} flex items-center justify-center`}>
            <SelectedIcon className="w-3 h-3 text-white" />
          </div>
          <div className="text-right">
            <div className="font-medium text-sm">{selectedConfig.displayName}</div>
            <div className="text-xs text-muted-foreground">{selectedConfig.provider}</div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <Card className="border shadow-lg">
            <CardContent className="p-0">
              <div className="max-h-96 overflow-auto">
                {Object.entries(groupedModels).map(([provider, models]) => (
                  <div key={provider}>
                    {/* Provider header */}
                    <div className="px-4 py-2 bg-muted/50 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm capitalize">{provider}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {getSpeedIndicator(provider)}
                        </div>
                      </div>
                    </div>

                    {/* Models */}
                    <div className="py-1">
                      {models.map(({ model, config }) => {
                        const Icon = modelIcons[model]
                        const isSelected = model === selectedModel
                        const costInfo = getCostIndicator(config.costPer1kTokens)

                        return (
                          <button
                            key={model}
                            onClick={() => handleModelSelect(model)}
                            className={`w-full px-4 py-3 text-right hover:bg-muted/50 transition-colors ${
                              isSelected ? 'bg-same-blue-50 border-r-2 border-same-blue-600' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${modelColors[config.provider]} flex items-center justify-center`}>
                                  <Icon className="w-4 h-4 text-white" />
                                </div>
                                
                                <div className="flex-1 text-right">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-sm">{config.displayName}</h4>
                                    {isSelected && <Check className="w-4 h-4 text-same-blue-600" />}
                                  </div>
                                  <p className="text-xs text-muted-foreground text-right">
                                    {config.description}
                                  </p>
                                  
                                  {/* Capabilities */}
                                  <div className="flex justify-end gap-1 mt-1">
                                    {config.capabilities.slice(0, 3).map((cap) => (
                                      <span
                                        key={cap}
                                        className="text-xs bg-muted px-1.5 py-0.5 rounded-full"
                                      >
                                        {cap === 'text' && 'نص'}
                                        {cap === 'code' && 'كود'}
                                        {cap === 'analysis' && 'تحليل'}
                                        {cap === 'multimodal' && 'متعدد'}
                                        {cap === 'reasoning' && 'استنتاج'}
                                        {cap === 'long-context' && 'طويل'}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="text-left">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                  <span>{config.maxTokens.toLocaleString()}</span>
                                  <span>رمز</span>
                                </div>
                                <div className={`flex items-center gap-1 text-xs ${costInfo.color}`}>
                                  <DollarSign className="w-3 h-3" />
                                  <span>{costInfo.level}</span>
                                </div>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer note */}
              <div className="px-4 py-2 bg-muted/30 border-t text-xs text-muted-foreground text-center">
                يمكنك تغيير النموذج في أي وقت أثناء المحادثة
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
