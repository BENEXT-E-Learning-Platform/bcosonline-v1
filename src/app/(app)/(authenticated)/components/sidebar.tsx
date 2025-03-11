'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  X,
  MessageSquare,
} from 'lucide-react'
import { useMediaQuery } from '../hooks/use-media-query'
import { cn } from '../lib/utils'
import { Button } from './ui/button'

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  direction: 'ltr' | 'rtl'
}

export function Sidebar({ open, onOpenChange, direction }: SidebarProps) {
  const pathname = usePathname()
  const isMobile = !useMediaQuery('(min-width: 1024px)')

  const navItems = [
    { name: 'Overview', href: '/overview', icon: LayoutDashboard },
    { name: 'Explore Courses', href: '/courses', icon: BookOpen },
    { name: 'My Courses', href: '/my-courses', icon: BookOpen },
    { name: 'Message', href: '/message', icon: MessageSquare },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const ChevronIcon = direction === 'rtl' ? ChevronLeft : ChevronRight

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white dark:bg-gray-900 border-r dark:border-gray-800 transition-all duration-300 ease-in-out lg:relative',
          open ? 'translate-x-0' : '-translate-x-full',
          'rtl:border-l rtl:border-r-0',
        )}
        dir={direction}
      >
        {/* Logo and close button */}
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-800">
          <Link href="/dashboard" className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="ml-2 text-xl font-bold text-primary">BCOS</span>
          </Link>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                )}
              >
                <item.icon className={cn('h-5 w-5', direction === 'rtl' ? 'ml-3' : 'mr-3')} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t dark:border-gray-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className={cn('h-5 w-5', direction === 'rtl' ? 'ml-3' : 'mr-3')} />
            Logout
          </Button>
        </div>

        {/* Toggle button (desktop) */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(!open)}
            className={cn(
              'absolute top-20 -right-3 h-6 w-6 rounded-full border bg-background shadow-md',
              direction === 'rtl' && '-left-3 right-auto',
            )}
          >
            <ChevronIcon className="h-3 w-3" />
          </Button>
        )}
      </div>
    </>
  )
}
