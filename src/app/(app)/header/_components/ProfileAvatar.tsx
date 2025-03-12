'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { IndividualAccount } from '@/payload-types'
import { User, Settings, LogOut } from 'lucide-react'
import { logout } from '../../(authenticated)/_actions/logout'

interface ProfileAvatarProps {
  user: IndividualAccount
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Get the user's initials for the avatar
  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((name) => name[0])
        .join('')
    : 'U'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout();
    // Optionally, you can redirect the user to the login page after logout
    window.location.href = '/';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <div className="flex items-center">
        <div className="mr-3 hidden sm:block">
          <p className="text-[#253b74] text-sm font-medium">{user.fullName || 'User'}</p>
          <p className="text-[#253b74]/60 text-xs">{user.email || 'user@example.com'}</p>
        </div>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#253b74] to-[#1a2c59] border-2 border-[#91be3f] rounded-full text-white font-semibold hover:border-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#91be3f] focus:ring-offset-1 focus:ring-offset-[#253b74]"
          aria-label="User menu"
        >
          {initials}
        </button>
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
          {/* User info header */}
          <div className="bg-gradient-to-r from-[#253b74] to-[#304a8c] px-4 py-3">
            <p className="text-white font-medium truncate">{user.fullName || 'User'}</p>
            <p className="text-white/70 text-sm truncate">{user.email || 'user@example.com'}</p>
          </div>
          <div className="py-1">
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsDropdownOpen(false)}
            >
              <User size={16} className="mr-2 text-[#253b74]" />
              Profile
            </Link>
            <Link
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings size={16} className="mr-2 text-[#253b74]" />
              Settings
            </Link>
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileAvatar