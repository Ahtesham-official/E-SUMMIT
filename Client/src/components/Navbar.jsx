import React, { useState, useEffect, useRef } from 'react'
import '../index.css'
import { gsap } from 'gsap'

const Navbar = ({ animate }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    if (!animate) return
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.1 }
    )
  }, [animate])

  const links = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Events', href: '#what-to-expect' },
    { label: 'Speakers', href: '#speakers' },
    { label: 'Schedule', href: '#schedule' },
    { label: 'Partners', href: '#partners' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <nav ref={navRef} className='fixed top-0 left-0 w-full h-[10vh] nav z-50 flex items-center justify-between px-6 md:px-10' style={{ opacity: 0 }}>
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-[#0E2044] font-extrabold text-xl tracking-wide">ESUMMIT</h1>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6 lg:gap-8 navy font-[500] text-sm">
        {links.map(link => (
          <a key={link.label} href={link.href} className="hover:text-red-600 transition-colors">
            {link.label}
          </a>
        ))}
        <button className='redBg text-white px-5 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity whitespace-nowrap'>
          Register Now &gt;
        </button>
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
      <div className={`absolute top-[10vh] left-0 w-full nav flex flex-col items-center gap-6 py-8 md:hidden transition-all duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {links.map(link => (
          <a key={link.label} href={link.href} className="navy font-semibold text-lg hover:text-red-600 transition-colors" onClick={() => setMenuOpen(false)}>
            {link.label}
          </a>
        ))}
        <button className='redBg text-white px-8 py-3 rounded-lg font-bold w-max'>
          Register Now &gt;
        </button>
      </div>
    </nav>
  )
}

export default Navbar