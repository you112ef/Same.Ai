'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Paperclip, 
  Upload, 
  X, 
  FileText, 
  Image, 
  Music, 
  Video,
  File as FileIcon,
  Check,
  Loader2
} from 'lucide-react'
import { FileType } from '@/shared/types'
import { useToast } from '@/hooks/use-toast'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: FileType
  url?: string
  progress?: number
}

interface FileUploadProps {
  onFileUpload: (file: UploadedFile) => void
  maxFileSize?: number // in MB
  allowedTypes?: string[]
  multiple?: boolean
}

const FILE_TYPE_ICONS = {
  [FileType.DOCUMENT]: FileText,
  [FileType.IMAGE]: Image,
  [FileType.AUDIO]: Music,
  [FileType.VIDEO]: Video,
  [FileType.OTHER]: FileIcon
}

const ALLOWED_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  documents: [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  video: ['video/mp4', 'video/webm', 'video/ogg'],
  code: ['text/javascript', 'text/html', 'text/css', 'application/json']
}

export function FileUpload({ 
  onFileUpload, 
  maxFileSize = 10, 
  allowedTypes = [],
  multiple = false 
}: FileUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<UploadedFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const getFileType = (mimeType: string): FileType => {
    if (ALLOWED_TYPES.images.includes(mimeType)) return FileType.IMAGE
    if (ALLOWED_TYPES.documents.includes(mimeType)) return FileType.DOCUMENT
    if (ALLOWED_TYPES.audio.includes(mimeType)) return FileType.AUDIO
    if (ALLOWED_TYPES.video.includes(mimeType)) return FileType.VIDEO
    return FileType.OTHER
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `حجم الملف يجب أن يكون أقل من ${maxFileSize} ميجابايت`
    }

    // Check file type if restrictions are set
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return 'نوع الملف غير مدعوم'
    }

    return null
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 بايت'
    const k = 1024
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const simulateUpload = async (file: File): Promise<UploadedFile> => {
    const uploadedFile: UploadedFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: getFileType(file.type),
      progress: 0
    }

    setUploadingFiles(prev => [...prev, uploadedFile])

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUploadingFiles(prev => 
        prev.map(f => f.id === uploadedFile.id ? { ...f, progress } : f)
      )
    }

    // Simulate getting file URL
    const finalFile = {
      ...uploadedFile,
      url: URL.createObjectURL(file),
      progress: 100
    }

    setUploadingFiles(prev => prev.filter(f => f.id !== uploadedFile.id))
    return finalFile
  }

  const handleFileSelect = async (files: FileList) => {
    const filesToUpload = Array.from(files)

    for (const file of filesToUpload) {
      const error = validateFile(file)
      if (error) {
        toast({
          title: 'خطأ في الملف',
          description: `${file.name}: ${error}`,
          variant: 'destructive'
        })
        continue
      }

      try {
        const uploadedFile = await simulateUpload(file)
        onFileUpload(uploadedFile)
        toast({
          title: 'تم رفع الملف',
          description: `تم رفع ${file.name} بنجاح`
        })
      } catch (error) {
        toast({
          title: 'خطأ في الرفع',
          description: `فشل في رفع ${file.name}`,
          variant: 'destructive'
        })
      }
    }

    setIsOpen(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeUploadingFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id))
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        <Paperclip className="w-4 h-4" />
        {uploadingFiles.length > 0 && (
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-xs text-white">{uploadingFiles.length}</span>
          </div>
        )}
      </Button>

      {/* Upload Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">رفع ملف</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Drag and drop area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver 
                    ? 'border-same-blue-600 bg-same-blue-50' 
                    : 'border-muted-foreground/25 hover:border-same-blue-600/50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-lg font-medium mb-2">اسحب الملفات هنا</h4>
                <p className="text-muted-foreground mb-4">
                  أو اضغط لاختيار الملفات من جهازك
                </p>
                
                <Button onClick={() => fileInputRef.current?.click()}>
                  اختيار ملفات
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={multiple}
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                  className="hidden"
                  accept={allowedTypes.join(',')}
                />
              </div>

              {/* File type info */}
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>أنواع الملفات المدعومة:</p>
                <div className="flex flex-wrap gap-2">
                  {['PDF', 'Word', 'Excel', 'PowerPoint', 'صور', 'صوت', 'فيديو'].map((type) => (
                    <span key={type} className="bg-muted px-2 py-1 rounded text-xs">
                      {type}
                    </span>
                  ))}
                </div>
                <p>الحد الأقصى: {maxFileSize} ميجابايت</p>
              </div>

              {/* Uploading files */}
              {uploadingFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">جاري الرفع:</h4>
                  {uploadingFiles.map((file) => {
                    const Icon = FILE_TYPE_ICONS[file.type]
                    return (
                      <div key={file.id} className="flex items-center gap-3 p-2 bg-muted rounded">
                        <Icon className="w-4 h-4" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium truncate">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeUploadingFile(file.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-background rounded-full h-1.5">
                              <div
                                className="bg-same-blue-600 h-1.5 rounded-full transition-all"
                                style={{ width: `${file.progress || 0}%` }}
                              />
                            </div>
                            <span className="text-xs">{file.progress || 0}%</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                        {file.progress === 100 ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}