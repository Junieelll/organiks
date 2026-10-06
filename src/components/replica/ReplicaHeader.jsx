import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { BOOKING_URL } from '../../constants/config'
import { usePageTransition } from './PageTransition'

export default function ReplicaHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { go } = usePageTransition()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const navLinks = [
    { label: 'Home',           href: '/',          anchor: '#home',     type: 'home' },
    { label: 'Services',       href: '/services',  anchor: null,        type: 'route' },
    { label: 'About Organiks', href: '/about',          anchor: null,    type: 'route' },
    { label: 'Location',       href: '/location',  anchor: null,        type: 'route' },
  ]

  const handleLinkClick = (e, link) => {
    e.preventDefault()
    setMenuOpen(false)

    const onHome = location.pathname === '/'

    // Page links: the curtain handles the route change and the scroll reset,
    // so the old page never visibly scrolls to the top before changing.
    if (link.type === 'route') {
      if (location.pathname === link.href) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        go(link.href)
      }
      return
    }

    if (link.type === 'home') {
      if (onHome) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        go('/')
      }
      return
    }

    // Section links (About, Location): smooth scroll if already on Home,
    // otherwise change page and land directly on the section.
    if (onHome) {
      document.querySelector(link.anchor)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      go('/', { anchor: link.anchor })
    }
  }

  // Only the Home hero is dark enough for the transparent header,
  // so every other page (Services, About, ...) gets the solid style
  const solidHeader = scrolled || location.pathname !== '/'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        solidHeader
          ? 'bg-[#F4EEE3]/95 backdrop-blur-md shadow-sm border-b border-[#E6D9C2]/60'
          : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-16 sm:h-20 flex items-center justify-between transition-all duration-300">
        {/* Logo */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, { type: 'home', anchor: '#home' })}
          className="flex flex-col items-center leading-none text-[#566B3F] no-underline group select-none"
        >
          <img
            src="/images/logo.webp"
            alt="Organiks Salon and Wellness Spa"
            className={`h-14 sm:h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
              solidHeader
                ? ''
                : 'brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]'
            }`}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextSibling.style.display = 'flex'
            }}
          />
          <div style={{ display: 'none' }} className="flex-col items-center">
            <b
              className={`text-[22px] font-medium tracking-[0.06em] ${
                solidHeader ? 'text-[#566B3F]' : 'text-white'
              }`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              ORGANIKS
            </b>
            <small
              className="text-[6px] tracking-[0.22em] text-[#B8975A] mt-1 uppercase"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Salon and Wellness Spa
            </small>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          <ul className="flex items-center gap-7 list-none m-0 p-0">
            {navLinks.map((link) => {
              const isActive =
                link.type === 'route'
                  ? location.pathname === link.href
                  : link.type === 'home'
                  ? location.pathname === '/'
                  : false

              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                    className={`text-[13px] tracking-[0.03em] transition-colors no-underline font-medium ${
                      solidHeader
                        ? isActive
                          ? 'text-[#566B3F] font-semibold'
                          : 'text-[#222] hover:text-[#566B3F]'
                        : isActive
                        ? 'text-white font-semibold'
                        : 'text-white/90 hover:text-white drop-shadow-sm'
                    }`}
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
            <li>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block px-5 py-2 rounded-full text-[12.5px] font-medium transition-all no-underline shadow-sm ${
                  solidHeader
                    ? 'bg-[#14291F] hover:bg-[#1E3D2D] text-[#F4EEE3]'
                    : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30'
                }`}
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Book Now
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile Animated Hamburger Button */}
        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
          whileTap={{ scale: 0.92 }}
          className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-transparent border-0 p-1"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`w-6 h-[2px] rounded-full transition-colors ${
              solidHeader ? 'bg-[#222]' : 'bg-white'
            }`}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`w-6 h-[2px] rounded-full transition-colors ${
              solidHeader ? 'bg-[#222]' : 'bg-white'
            }`}
          />
        </motion.button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-[#F4EEE3]/98 backdrop-blur-xl border-t border-[#E6D9C2] shadow-2xl"
          >
            <motion.ul
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
                closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
              className="flex flex-col gap-3 px-6 py-5 list-none m-0 p-0"
            >
              {navLinks.map((link) => (
                <motion.li
                  key={link.label}
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: -8 },
                  }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                    className={`block text-base font-medium tracking-[0.02em] py-1.5 transition-colors no-underline ${
                      (link.type === 'route' && location.pathname === link.href) ||
                      (link.type === 'home' && location.pathname === '/')
                        ? 'text-[#566B3F] font-semibold'
                        : 'text-[#222] hover:text-[#566B3F]'
                    }`}
                    style={{ fontFamily: 'var(--font-poppins)' }}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: -8 },
                }}
                className="pt-2"
              >
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-[#14291F] hover:bg-[#1E3D2D] text-[#F4EEE3] py-3 rounded-full text-sm font-medium shadow-md transition-colors no-underline"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Book Your Appointment
                </a>
              </motion.li>
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}