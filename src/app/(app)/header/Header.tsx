/* eslint-disable react/react-in-jsx-scope */
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, MessageSquare, Menu } from 'lucide-react'

interface HeaderProps {
  user: any | null
}

const ClientHeader: React.FC<HeaderProps> = ({ user }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Keep the scroll effect
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
      className={`fixed top-0 z-50 transition-all duration-300 left-1/2 -translate-x-1/2 ${scrolled
          ? 'bg-white shadow-xl rounded-full max-w-7xl m-3 w-[calc(100%-1.5rem)]'
          : 'bg-transparent w-full'
        }`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <div className="w-8 h-8 bg-[#91be3f] rounded flex items-center justify-center ml-2 group-hover:bg-white transition-colors duration-200">
              <span className={`font-bold text-lg ${scrolled ? 'text-[#253b74]' : 'text-white'}`}>
                ع
              </span>
            </div>
            <Image
              src="/assets/images/file.svg"
              alt="Logo"
              width={30}
              height={30}
              className="object-cover"
            />
          </Link>
        </div>

        {/* Navigation Links - Only visible on larger screens */}
        <div className="hidden md:flex items-center space-x-reverse space-x-6">
          <Link
            href="/courses"
            className={`hover:text-[#91be3f] transition-colors duration-200 ${scrolled ? 'text-[#253b74]' : 'text-white'
              }`}
          >
            دوراتنا
          </Link>
          <Link
            href="/about"
            className={`hover:text-[#91be3f] transition-colors duration-200 ${scrolled ? 'text-[#253b74]' : 'text-white'
              }`}
          >
            من نحن
          </Link>
          <Link
            href="/join"
            className={`hover:text-[#91be3f] transition-colors duration-200 ${scrolled ? 'text-[#253b74]' : 'text-white'
              }`}
          >
            انضم إلينا كمكون
          </Link>
          <Link
            href="/support"
            className={`hover:text-[#91be3f] transition-colors duration-200 ${scrolled ? 'text-[#253b74]' : 'text-white'
              }`}
          >
            تواصل معنا
          </Link>
        </div>

        {/* Right Side - User or Auth */}
        <div className="flex items-center space-x-reverse space-x-4">
          {user ? (
            <>
              {/* Notification Icons */}
              <button className={`p-2 hover:text-[#91be3f] transition-colors relative ${scrolled ? 'text-[#253b74]' : 'text-white'
                }`}>
                <Bell size={20} />
                <span className="absolute top-0 left-0 w-4 h-4 bg-[#91be3f] rounded-full text-[10px] flex items-center justify-center text-white">
                  ٣
                </span>
              </button>
              <button className={`p-2 hover:text-[#91be3f] transition-colors ${scrolled ? 'text-[#253b74]' : 'text-white'
                }`}>
                <MessageSquare size={20} />
              </button>
              <div className={`h-6 w-px mx-1 ${scrolled ? 'bg-[#253b74]/20' : 'bg-white/20'}`}></div>
              <div className="relative">
                <button className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                  <Image
                    src="/api/placeholder/32/32"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`px-5 py-2 text-sm font-medium rounded transition-all duration-200 ${scrolled
                    ? 'text-[#253b74] border border-[#253b74]/30 hover:bg-[#253b74]/10'
                    : 'text-white border border-white/30 hover:bg-white/10'
                  }`}
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 text-sm font-medium text-white bg-[#91be3f] rounded hover:bg-[#91be3f]/90 transition-all duration-200 shadow-sm"
              >
                إنشاء حساب
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} className={scrolled ? 'text-[#253b74]' : 'text-white'} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 px-4">
          <div className="flex flex-col space-y-3">
            <Link
              href="/courses"
              className="text-[#253b74] hover:text-[#91be3f] transition-colors duration-200 py-2"
            >
              الدورات
            </Link>
            <Link
              href="/features"
              className="text-[#253b74] hover:text-[#91be3f] transition-colors duration-200 py-2"
            >
              المميزات
            </Link>
            <Link
              href="/support"
              className="text-[#253b74] hover:text-[#91be3f] transition-colors duration-200 py-2"
            >
              الدعم
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default ClientHeader