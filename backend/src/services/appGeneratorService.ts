import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface GeneratedApp {
  id: string
  name: string
  description: string
  prompt: string
  model: string
  files: GeneratedFile[]
  dependencies: string[]
  scripts: Record<string, string>
  preview_url?: string
  created_at: Date
  updated_at: Date
}

export interface GeneratedFile {
  path: string
  content: string
  type: 'component' | 'page' | 'api' | 'config' | 'style' | 'other'
  language: string
}

export class AppGeneratorService {
  private outputDir = './generated-apps'
  
  constructor() {
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true })
    }
  }

  async generateApp(prompt: string, model: string): Promise<GeneratedApp> {
    const appId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const appName = this.extractAppName(prompt)
    
    // Generate app structure based on prompt
    const appStructure = await this.analyzePromptAndGenerateStructure(prompt, model)
    
    // Create files
    const files = await this.generateFiles(appStructure, prompt)
    
    // Create app directory
    const appPath = path.join(this.outputDir, appId)
    fs.mkdirSync(appPath, { recursive: true })
    
    // Write files to disk
    await this.writeFilesToDisk(appPath, files)
    
    // Generate package.json
    const packageJson = this.generatePackageJson(appName, appStructure.dependencies)
    fs.writeFileSync(
      path.join(appPath, 'package.json'), 
      JSON.stringify(packageJson, null, 2)
    )
    
    // Install dependencies
    await this.installDependencies(appPath)
    
    // Start development server
    const previewUrl = await this.startDevServer(appPath, appId)
    
    const generatedApp: GeneratedApp = {
      id: appId,
      name: appName,
      description: this.generateDescription(prompt),
      prompt,
      model,
      files,
      dependencies: appStructure.dependencies,
      scripts: packageJson.scripts,
      preview_url: previewUrl,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    // Save app metadata
    fs.writeFileSync(
      path.join(appPath, 'app.json'),
      JSON.stringify(generatedApp, null, 2)
    )
    
    return generatedApp
  }

  private extractAppName(prompt: string): string {
    // Extract app name from prompt using AI or simple patterns
    const matches = prompt.match(/(?:create|build|make)\s+(?:a|an)?\s+([^,\.]+)/)
    if (matches && matches[1]) {
      return matches[1].trim().replace(/\s+/g, '-').toLowerCase()
    }
    return `app-${Date.now()}`
  }

  private async analyzePromptAndGenerateStructure(prompt: string, model: string) {
    // Analyze the prompt to determine app type and required structure
    const isEcommerce = /shop|store|ecommerce|cart|payment/.test(prompt.toLowerCase())
    const isBlog = /blog|article|post|cms/.test(prompt.toLowerCase())
    const isDashboard = /dashboard|admin|analytics|chart/.test(prompt.toLowerCase())
    const isBooking = /book|appointment|calendar|schedule/.test(prompt.toLowerCase())
    const isChat = /chat|message|conversation/.test(prompt.toLowerCase())
    const isCrud = /manage|crud|list|create|edit|delete/.test(prompt.toLowerCase())
    
    let dependencies = [
      'react',
      'react-dom',
      'next',
      'typescript',
      '@types/react',
      '@types/react-dom',
      '@types/node',
      'tailwindcss',
      'postcss',
      'autoprefixer'
    ]
    
    let features = ['responsive-design', 'modern-ui']
    
    if (isEcommerce) {
      dependencies.push('stripe', '@stripe/stripe-js', 'zustand')
      features.push('payment-integration', 'shopping-cart', 'product-catalog')
    }
    
    if (isBlog) {
      dependencies.push('markdown-to-jsx', 'gray-matter', 'date-fns')
      features.push('markdown-support', 'blog-posts', 'categories')
    }
    
    if (isDashboard) {
      dependencies.push('recharts', 'lucide-react', 'date-fns')
      features.push('charts', 'analytics', 'data-visualization')
    }
    
    if (isBooking) {
      dependencies.push('react-calendar', 'date-fns', 'react-hook-form')
      features.push('calendar-integration', 'booking-system', 'time-slots')
    }
    
    if (isChat) {
      dependencies.push('socket.io-client', 'zustand')
      features.push('real-time-messaging', 'websockets')
    }
    
    if (isCrud) {
      dependencies.push('react-hook-form', 'zod', 'zustand')
      features.push('form-handling', 'validation', 'data-management')
    }
    
    return {
      type: isEcommerce ? 'ecommerce' : isBlog ? 'blog' : isDashboard ? 'dashboard' : 
            isBooking ? 'booking' : isChat ? 'chat' : 'webapp',
      dependencies,
      features,
      database: isCrud || isEcommerce || isBooking || isChat,
      auth: isEcommerce || isDashboard || isBooking || isChat
    }
  }

  private async generateFiles(structure: any, prompt: string): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = []
    
    // Generate basic Next.js structure
    files.push({
      path: 'app/layout.tsx',
      content: this.generateLayoutFile(structure),
      type: 'component',
      language: 'typescript'
    })
    
    files.push({
      path: 'app/page.tsx',
      content: this.generateHomePage(prompt, structure),
      type: 'page',
      language: 'typescript'
    })
    
    files.push({
      path: 'app/globals.css',
      content: this.generateGlobalCSS(),
      type: 'style',
      language: 'css'
    })
    
    files.push({
      path: 'tailwind.config.js',
      content: this.generateTailwindConfig(),
      type: 'config',
      language: 'javascript'
    })
    
    files.push({
      path: 'next.config.js',
      content: this.generateNextConfig(),
      type: 'config',
      language: 'javascript'
    })
    
    files.push({
      path: 'tsconfig.json',
      content: this.generateTSConfig(),
      type: 'config',
      language: 'json'
    })
    
    // Generate specific components based on app type
    if (structure.type === 'booking') {
      files.push(...this.generateBookingComponents(prompt))
    } else if (structure.type === 'ecommerce') {
      files.push(...this.generateEcommerceComponents(prompt))
    } else if (structure.type === 'dashboard') {
      files.push(...this.generateDashboardComponents(prompt))
    } else if (structure.type === 'blog') {
      files.push(...this.generateBlogComponents(prompt))
    } else if (structure.type === 'chat') {
      files.push(...this.generateChatComponents(prompt))
    } else {
      files.push(...this.generateGenericComponents(prompt))
    }
    
    // Generate API routes if needed
    if (structure.database) {
      files.push(...this.generateAPIRoutes(structure))
    }
    
    return files
  }

  private generateLayoutFile(structure: any): string {
    return `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '${structure.type.charAt(0).toUpperCase() + structure.type.slice(1)} App',
  description: 'Generated with Same.AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
`
  }

  private generateHomePage(prompt: string, structure: any): string {
    const appName = this.extractAppName(prompt)
    
    return `'use client'

import { useState } from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                ${appName.charAt(0).toUpperCase() + appName.slice(1).replace(/-/g, ' ')}
              </h1>
            </div>
            <nav className="flex space-x-8">
              <a href="#" className="text-gray-500 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your New App
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            ${prompt}
          </p>
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Features Available:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              ${structure.features.map((feature: string) => `
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-900">${feature.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</h4>
                <p className="text-sm text-gray-600 mt-1">Ready to use</p>
              </div>
              `).join('')}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
`
  }

  private generateBookingComponents(prompt: string): GeneratedFile[] {
    return [
      {
        path: 'components/BookingForm.tsx',
        content: `'use client'

import { useState } from 'react'

export default function BookingForm() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle booking submission
    console.log('Booking submitted:', { selectedDate, selectedTime, customerInfo })
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Book an Appointment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Time
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Choose a time</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Book Appointment
        </button>
      </form>
    </div>
  )
}
`,
        type: 'component',
        language: 'typescript'
      }
    ]
  }

  private generateEcommerceComponents(prompt: string): GeneratedFile[] {
    return [
      {
        path: 'components/ProductCard.tsx',
        content: `interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    description: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">
            $\{product.price}
          </span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
`,
        type: 'component',
        language: 'typescript'
      }
    ]
  }

  private generateDashboardComponents(prompt: string): GeneratedFile[] {
    return [
      {
        path: 'components/StatsCard.tsx',
        content: `interface StatsCardProps {
  title: string
  value: string | number
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
}

export default function StatsCard({ title, value, change, changeType }: StatsCardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType]

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="flex items-baseline">
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        <span className={\`ml-2 text-sm \${changeColor}\`}>
          {change}
        </span>
      </div>
    </div>
  )
}
`,
        type: 'component',
        language: 'typescript'
      }
    ]
  }

  private generateBlogComponents(prompt: string): GeneratedFile[] {
    return [
      {
        path: 'components/BlogPost.tsx',
        content: `interface BlogPostProps {
  post: {
    id: string
    title: string
    excerpt: string
    content: string
    author: string
    date: string
    image?: string
  }
}

export default function BlogPost({ post }: BlogPostProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      {post.image && (
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {post.title}
        </h2>
        <p className="text-gray-600 mb-4">
          {post.excerpt}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>By {post.author}</span>
          <span>{post.date}</span>
        </div>
      </div>
    </article>
  )
}
`,
        type: 'component',
        language: 'typescript'
      }
    ]
  }

  private generateChatComponents(prompt: string): GeneratedFile[] {
    return [
      {
        path: 'components/ChatInterface.tsx',
        content: `'use client'

import { useState } from 'react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'other'
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        sender: 'user',
        timestamp: new Date()
      }
      setMessages([...messages, newMessage])
      setInputText('')
    }
  }

  return (
    <div className="flex flex-col h-96 bg-white border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(message => (
          <div
            key={message.id}
            className={\`flex \${message.sender === 'user' ? 'justify-end' : 'justify-start'}\`}
          >
            <div
              className={\`max-w-xs px-4 py-2 rounded-lg \${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }\`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
`,
        type: 'component',
        language: 'typescript'
      }
    ]
  }

  private generateGenericComponents(prompt: string): GeneratedFile[] {
    return [
      {
        path: 'components/Hero.tsx',
        content: `export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Your App
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Built with modern technology and best practices
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}
`,
        type: 'component',
        language: 'typescript'
      }
    ]
  }

  private generateAPIRoutes(structure: any): GeneratedFile[] {
    return [
      {
        path: 'app/api/health/route.ts',
        content: `export async function GET() {
  return Response.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  })
}
`,
        type: 'api',
        language: 'typescript'
      }
    ]
  }

  private generateGlobalCSS(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: system-ui, sans-serif;
  }
}
`
  }

  private generateTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`
  }

  private generateNextConfig(): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
`
  }

  private generateTSConfig(): string {
    return `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`
  }

  private generatePackageJson(name: string, dependencies: string[]) {
    const devDependencies = [
      '@types/node',
      '@types/react',
      '@types/react-dom',
      'autoprefixer',
      'eslint',
      'eslint-config-next',
      'postcss',
      'tailwindcss',
      'typescript'
    ]

    return {
      name: name,
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      },
      dependencies: dependencies.reduce((acc, dep) => {
        acc[dep] = 'latest'
        return acc
      }, {} as Record<string, string>),
      devDependencies: devDependencies.reduce((acc, dep) => {
        acc[dep] = 'latest'
        return acc
      }, {} as Record<string, string>)
    }
  }

  private async writeFilesToDisk(appPath: string, files: GeneratedFile[]) {
    for (const file of files) {
      const filePath = path.join(appPath, file.path)
      const dirPath = path.dirname(filePath)
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
      
      fs.writeFileSync(filePath, file.content)
    }
  }

  private async installDependencies(appPath: string) {
    try {
      await execAsync('npm install', { cwd: appPath })
    } catch (error) {
      console.error('Failed to install dependencies:', error)
    }
  }

  private async startDevServer(appPath: string, appId: string): Promise<string> {
    // In a real implementation, you'd manage multiple dev servers
    // For now, return a mock URL
    return `http://localhost:${3000 + Math.floor(Math.random() * 1000)}`
  }

  private generateDescription(prompt: string): string {
    return `Generated app based on: "${prompt}"`
  }

  async getApp(appId: string): Promise<GeneratedApp | null> {
    const appPath = path.join(this.outputDir, appId, 'app.json')
    if (fs.existsSync(appPath)) {
      const appData = JSON.parse(fs.readFileSync(appPath, 'utf-8'))
      return appData
    }
    return null
  }

  async listApps(): Promise<GeneratedApp[]> {
    const apps: GeneratedApp[] = []
    const dirs = fs.readdirSync(this.outputDir)
    
    for (const dir of dirs) {
      const appPath = path.join(this.outputDir, dir, 'app.json')
      if (fs.existsSync(appPath)) {
        const appData = JSON.parse(fs.readFileSync(appPath, 'utf-8'))
        apps.push(appData)
      }
    }
    
    return apps.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
  }
}
