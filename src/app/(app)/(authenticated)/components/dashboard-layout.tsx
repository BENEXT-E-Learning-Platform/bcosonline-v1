'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useMediaQuery } from '../hooks/use-media-query'
import { cn } from '../lib/utils'
import { useDirection } from './direction-provider'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const { direction } = useDirection()

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar')
      if (sidebar && !sidebar.contains(event.target as Node) && !isDesktop) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDesktop])

  // Auto-open sidebar on desktop
  useEffect(() => {
    if (isDesktop) {
      setSidebarOpen(true)
    } else {
      setSidebarOpen(false)
    }
  }, [isDesktop])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} direction={direction} />
      <div
        className={cn('flex flex-col flex-1 w-0 overflow-hidden', direction === 'rtl' && 'mr-auto')}
      >
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          <div className={cn('py-6 px-4 sm:px-6 md:px-8', direction === 'rtl' && 'text-right')}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
