import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import ProgressModal from './components/ProgressModal'
import FloatingProgressButton from './components/FloatingProgressButton'

export default function App() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <main className="flex-1 flex flex-col items-center justify-center min-h-dvh bg-brand-bg px-6 py-8 text-center gap-4">
        <p className="text-[0.75rem] font-semibold tracking-[0.2em] uppercase text-brand-secondary">
          Coming Soon
        </p>
        <h1
          className="font-medium text-brand-dark leading-[1.15] m-0"
          style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem,6vw,4.5rem)' }}
        >
          Organiks Salon<br />&amp; Wellness Spa
        </h1>
        <p className="text-brand-muted text-[0.95rem] max-w-[380px] mx-auto">
          Our new website is being crafted with care. Click the button below to follow our progress.
        </p>
        <div className="w-12 h-0.5 mx-auto mt-1" style={{ background: 'linear-gradient(90deg, #8B5E3C, #C9A98A)' }} />
      </main>

      <FloatingProgressButton onClick={() => setOpen(true)} />
      <AnimatePresence>
        {open && <ProgressModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
