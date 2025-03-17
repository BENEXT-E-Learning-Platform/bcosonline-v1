'use client'

import { useState, useEffect } from 'react'
import { IndividualAccount } from '@/payload-types'
import ProfileAvatar from './_components/ProfileAvatar'
import { Bell, Link, MessageSquare } from 'lucide-react'

interface HeaderProps {
  user: IndividualAccount | null
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [scrolled, setScrolled] = useState(false)

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      dir="rtl"
      className={`border-b sticky w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <a href="/dashboard" className="flex items-center group">
            <div className="w-8 h-8 bg-[#91be3f] rounded flex items-center justify-center ml-2 group-hover:bg-white transition-colors duration-200">
              <span className="text-[#253b74] font-bold text-lg"></span>
            </div>
            <span className="text-[#253b74] font-semibold text-lg group-hover:text-[#91be3f] transition-colors duration-200">
              BCOS
            </span>
          </a>
        </div>

        {/* Navigation Links - Only visible on larger screens */}
        <div className="hidden md:flex items-center space-x-reverse space-x-6">
          <a
            href="/features"
            className="text-[#253b74] hover:text-[#91be3f] transition-colors duration-200"
          >
            المميزات
          </a>
          <a
            href="/courses"
            className="text-[#253b74] hover:text-[#91be3f] transition-colors duration-200"
          >
            الدورات
          </a>
          <a
            href="/support"
            className="text-[#253b74] hover:text-[#91be3f] transition-colors duration-200"
          >
            الدعم
          </a>
        </div>

        {/* Right Side - User or Auth */}
        <div className="flex items-center space-x-reverse space-x-4">
          {user ? (
            <>
              {/* Notification Icons */}
              <button className="p-2 text-[#253b74] hover:text-[#91be3f] transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-0 left-0 w-4 h-4 bg-[#91be3f] rounded-full text-[10px] flex items-center justify-center text-white">
                  ٣
                </span>
              </button>
              <button className="p-2 text-[#253b74] hover:text-[#91be3f] transition-colors">
                <MessageSquare size={20} />
              </button>
              <div className="h-6 w-px bg-[#253b74]/20 mx-1"></div>
              <ProfileAvatar user={user} />
            </>
          ) : (
            <>
              <a
                href="/login"
                className="px-5 py-2 text-sm font-medium text-[#253b74] border border-[#253b74]/30 rounded-lg hover:bg-[#253b74]/10 transition-all duration-200"
              >
                تسجيل الدخول
              </a>
              <a
                href="/signup"
                className="px-5 py-2 text-sm font-medium text-white bg-[#91be3f] rounded-lg hover:bg-[#91be3f]/90 transition-all duration-200 shadow-sm"
              >
                إنشاء حساب
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
