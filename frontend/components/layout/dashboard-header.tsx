'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Bell, 
  Settings, 
  User,
  HelpCircle,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}

export function DashboardHeader({ title, subtitle, actions }: DashboardHeaderProps) {
  const { user } = useAuth()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Title section */}
        <div className="flex items-center gap-4">
          {title && (
            <div>
              <h1 className="text-xl font-semibold">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="البحث في المحادثات..."
              className="pr-10 w-full"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Actions */}
          {actions}

          {/* Quick actions */}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/chat/new">
              <Sparkles className="w-4 h-4 ml-2" />
              محادثة جديدة
            </Link>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>

          {/* Help */}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/help">
              <HelpCircle className="w-4 h-4" />
            </Link>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/settings">
              <Settings className="w-4 h-4" />
            </Link>
          </Button>

          {/* User menu */}
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/profile">
              <div className="flex items-center gap-2">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-same-blue-600 to-same-purple-600 flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
                <span className="hidden sm:inline-block text-sm">
                  {user?.name?.split(' ')[0] || 'المستخدم'}
                </span>
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}