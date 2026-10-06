import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BOOKING_URL } from '../../constants/config'

export default function ReplicaHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'About Organiks', href: '#about' },
    { label: 'Location', href: '#location' },
  ]

  const handleLinkClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F4EEE3]/95 backdrop-blur-md shadow-sm border-b border-[#E6D9C2]/60'
          : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-16 sm:h-20 flex items-center justify-between transition-all duration-300">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, '#home')}
          className="flex flex-col items-center leading-none text-[#566B3F] no-underline group select-none"
        >
          <img
            src="/images/logo.webp"
            alt="Organiks Salon and Wellness Spa"
            className={`h-14 sm:h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
              scrolled
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
                scrolled ? 'text-[#566B3F]' : 'text-white'
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
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-[13px] tracking-[0.03em] transition-colors no-underline font-medium ${
                    scrolled
                      ? 'text-[#222] hover:text-[#566B3F]'
                      : 'text-white/90 hover:text-white drop-shadow-sm'
                  }`}
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block px-5 py-2 rounded-full text-[12.5px] font-medium transition-all no-underline shadow-sm ${
                  scrolled
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
              scrolled ? 'bg-[#222]' : 'bg-white'
            }`}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`w-6 h-[2px] rounded-full transition-colors ${
              scrolled ? 'bg-[#222]' : 'bg-white'
            }`}
          />
        </motion.button>
      </div>

      {/* Mobile Drawer Menu with Framer Motion Animation */}
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
                  key={link.href}
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: -8 },
                  }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="block text-base font-medium tracking-[0.02em] text-[#222] hover:text-[#566B3F] py-1.5 transition-colors no-underline"
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
