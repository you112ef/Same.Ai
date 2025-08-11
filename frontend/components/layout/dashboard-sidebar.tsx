'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Sparkles, 
  MessageSquare, 
  PlusCircle, 
  History, 
  Settings, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Files,
  Users,
  Zap
} from 'lucide-react'

const navigationItems = [
  {
    title: 'محادثة جديدة',
    href: '/chat/new',
    icon: PlusCircle,
    variant: 'gradient' as const
  },
  {
    title: 'المحادثات',
    href: '/chat',
    icon: MessageSquare
  },
  {
    title: 'السجل',
    href: '/dashboard/history',
    icon: History
  },
  {
    title: 'الملفات',
    href: '/dashboard/files',
    icon: Files
  },
  {
    title: 'الفرق',
    href: '/dashboard/teams',
    icon: Users
  }
]

const bottomItems = [
  {
    title: 'الإعدادات',
    href: '/dashboard/settings',
    icon: Settings
  },
  {
    title: 'الملف الشخصي',
    href: '/dashboard/profile',
    icon: User
  }
]

interface DashboardSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function DashboardSidebar({ collapsed = false, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className={`h-full bg-card border-l transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-same-blue-600 to-same-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Same.Ai</span>
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-1.5"
          >
            {collapsed ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col h-full p-4">
        <nav className="space-y-2 flex-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={item.variant || (isActive ? 'default' : 'ghost')}
                  className={`w-full justify-start gap-3 ${collapsed ? 'px-2' : 'px-3'}`}
                  size={collapsed ? 'sm' : 'default'}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Usage stats */}
        {!collapsed && (
          <Card className="p-3 mb-4 bg-gradient-to-r from-same-blue-50 to-same-purple-50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-same-blue-600" />
              <span className="text-sm font-medium">الاستخدام الشهري</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>المستخدم: 1,250 رمز</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                <div className="bg-gradient-to-r from-same-blue-600 to-same-purple-600 h-1.5 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
          </Card>
        )}

        {/* Bottom navigation */}
        <div className="space-y-2 pt-4 border-t">
          {bottomItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start gap-3 ${collapsed ? 'px-2' : 'px-3'}`}
                  size={collapsed ? 'sm' : 'default'}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Button>
              </Link>
            )
          })}

          {/* User info and logout */}
          <div className="pt-2">
            {!collapsed && user && (
              <div className="px-3 py-2 text-sm">
                <p className="font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
            
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={`w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 ${
                collapsed ? 'px-2' : 'px-3'
              }`}
              size={collapsed ? 'sm' : 'default'}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>تسجيل الخروج</span>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}