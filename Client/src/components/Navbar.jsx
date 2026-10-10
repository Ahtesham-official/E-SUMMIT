import React, { useState, useEffect, useRef } from 'react'
import '../index.css'
import { gsap } from 'gsap'
import { useAuth } from '../context/AuthContext'
import { useClerk } from '@clerk/react'
import { LogIn, LogOut, ChevronDown, User } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Navbar = ({ animate, onRegisterClick }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userDropOpen, setUserDropOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef(null)
  const dropRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const { isSignedIn, currentUserName, currentUserEmail, logout, loginWithClerk, isLoaded } = useAuth()
  const { openUserProfile } = useClerk()

  // Track scroll position to trigger shortened rounded navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!animate) return
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
    )
  }, [animate])

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setUserDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        e.preventDefault()
        navigate('/' + href)
      }
    }
  }

  const links = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Events', href: '/#what-to-expect' },
    { label: 'Speakers', href: '/speakers' },
    { label: 'Schedule', href: '/#schedule' },
    { label: 'Partners', href: '/#partners' },
  ]

  const avatarInitial = currentUserName ? currentUserName.charAt(0).toUpperCase() : '?'

  return (
    <nav
      ref={navRef}
      className={`fixed left-0 right-0 z-50 mx-auto flex items-center justify-between transition-all duration-500 ease-in-out ${scrolled
          ? 'top-3 w-[90%] max-w-6xl h-[8vh] min-h-[56px] rounded-full px-6 md:px-8 bg-white/75 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-[#0E2044]/10'
          : 'top-0 w-full h-[10vh] min-h-[64px] px-6 md:px-10 nav rounded-none'
        }`}
      style={{ opacity: 0 }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src="/esummit27-logo.svg" alt="E-SUMMIT Logo" className="h-10 sm:h-12 md:h-14 w-auto max-h-12 md:max-h-14 object-contain cursor-pointer transition-all duration-300" />
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6 lg:gap-8 navy font-[500] text-sm">
        {links.map(link => (
          link.href.startsWith('/') && !link.href.includes('#') ? (
            <Link key={link.label} to={link.href} className="hover:text-red-600 transition-colors">
              {link.label}
            </Link>
          ) : (
            <a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link.href.replace('/', ''))} className="hover:text-red-600 transition-colors">
              {link.label}
            </a>
          )
        ))}


        {/* Register Now button */}
        <button
          id="navbar-register-btn"
          onClick={onRegisterClick}
          className='redBg text-white px-5 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity whitespace-nowrap'
        >
          Register Now &gt;
        </button>

        {/* Auth area */}
        {!isLoaded ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        ) : isSignedIn ? (
          /* Signed-in user pill with dropdown */
          <div className="relative" ref={dropRef}>
            <button
              id="navbar-user-btn"
              onClick={() => setUserDropOpen(!userDropOpen)}
              className="flex items-center gap-2 bg-[#0E2044]/10 hover:bg-[#0E2044]/20 transition-colors px-3 py-1.5 rounded-full"
            >
              <div className="w-7 h-7 rounded-full navyBg text-white flex items-center justify-center text-xs font-bold shrink-0">
                {avatarInitial}
              </div>
              <span className="text-[#0E2044] font-semibold text-sm max-w-[120px] truncate">
                {currentUserName}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#0E2044] transition-transform ${userDropOpen ? 'rotate-180' : ''}`} />
            </button>

            {userDropOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-semibold text-[#0E2044] truncate mt-0.5">{currentUserName}</p>
                  <p className="text-xs text-gray-500 truncate">{currentUserEmail}</p>
                </div>
                <button
                  onClick={() => { openUserProfile(); setUserDropOpen(false) }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#0E2044] hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4" /> Manage Account
                </button>
                <button
                  id="navbar-signout-btn"
                  onClick={() => { logout(); setUserDropOpen(false) }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Sign In button */
          <button
            id="navbar-signin-btn"
            onClick={loginWithClerk}
            className="flex items-center gap-2 border border-[#0E2044] text-[#0E2044] px-4 py-1.5 rounded-lg font-semibold text-sm hover:bg-[#0E2044] hover:text-white transition-all"
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2 z-50"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-[#0E2044] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-[#0E2044] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-[#0E2044] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Mobile Dropdown */}
      <div className={`absolute left-0 w-full flex flex-col items-center gap-6 py-8 md:hidden transition-all duration-300 shadow-xl ${scrolled
          ? 'top-[calc(100%+10px)] bg-white/90 backdrop-blur-2xl rounded-2xl border border-white/80'
          : 'top-[10vh] nav'
        } ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {links.map(link => (
          <a key={link.label} href={link.href} className="navy font-semibold text-lg hover:text-red-600 transition-colors" onClick={() => setMenuOpen(false)}>
            {link.label}
          </a>
        ))}
        <button
          onClick={() => { onRegisterClick(); setMenuOpen(false) }}
          className='redBg text-white px-8 py-3 rounded-lg font-bold w-max'
        >
          Register Now &gt;
        </button>

        {isLoaded && (
          isSignedIn ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full navyBg text-white flex items-center justify-center text-sm font-bold">
                  {avatarInitial}
                </div>
                <span className="font-semibold text-[#0E2044]">{currentUserName}</span>
              </div>
              <button
                onClick={() => { logout(); setMenuOpen(false) }}
                className="flex items-center gap-2 text-red-600 font-semibold text-sm border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => { loginWithClerk(); setMenuOpen(false) }}
              className="flex items-center gap-2 border border-[#0E2044] text-[#0E2044] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#0E2044] hover:text-white transition-all"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </button>
          )
        )}
      </div>
    </nav>
  )
}

export default Navbar