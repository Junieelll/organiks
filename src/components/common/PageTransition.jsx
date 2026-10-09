/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Page transition: a brand-green curtain drops over the screen, the route
 * changes (and scroll resets) while it is covering everything, then the
 * curtain keeps falling and uncovers the new page from the top.
 *
 * The user never sees the old page scroll to the top or the content swap.
 *
 * Usage:
 *   <BrowserRouter>
 *     <PageTransitionProvider>
 *       <Header />
 *       <Routes>…</Routes>
 *     </PageTransitionProvider>
 *   </BrowserRouter>
 *
 *   const { go } = usePageTransition()
 *   go('/services')                       // change page
 *   go('/', { anchor: '#location' })      // change page, land on a section
 *
 *   // a green circle grows from the click point, shows the destination name,
 *   // then shrinks away to reveal the new page
 *   goReveal('/services', { x: e.clientX, y: e.clientY, label: 'Facial Services',
 *                          anchor: '#services-anchor', state: { category: 'facials' } })
 */

const PageTransitionContext = createContext(null)

const EASE = [0.76, 0, 0.24, 1]
const COVER_S = 0.5      // curtain drops over the page
const REVEAL_S = 0.6     // curtain falls away
const EXPAND_S = 0.7     // circle grows from the click point
const HOLD_MS = 250      // destination name stays readable
const SHRINK_S = 0.6     // circle shrinks away
// How long a freshly mounted page should wait (seconds) so its own entrance
// animation plays after the overlay has lifted.
const ENTER_DELAY_CURTAIN = 0.4
const ENTER_DELAY_REVEAL = 0.8
const MOUNT_WAIT_MS = 150 // let the new route mount before uncovering
const EDGE = 60          // curved edge height (px), kept off-screen when covering

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// 'instant' beats any CSS `scroll-behavior: smooth` on <html>
const jumpTo = (anchor) => {
  if (anchor) {
    document.querySelector(anchor)?.scrollIntoView({ behavior: 'instant', block: 'start' })
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }
}

export function PageTransitionProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const reduce = useReducedMotion()
  const controls = useAnimationControls()
  const [active, setActive] = useState(false)
  const [reveal, setReveal] = useState(null)
  const revealControls = useAnimationControls()
  const labelControls = useAnimationControls()

  const busy = useRef(false)
  const transitioning = useRef(0) // seconds a new page should delay its entrance (0 = none)
  const pathRef = useRef(location.pathname)
  useEffect(() => {
    pathRef.current = location.pathname
  }, [location.pathname])

  const go = useCallback(
    async (to, { anchor, state } = {}) => {
      if (busy.current) return
      if (to === pathRef.current && !anchor) return
      busy.current = true

      // Reduced motion: no curtain, just change page and reset scroll.
      if (reduce) {
        navigate(to, { state })
        await wait(MOUNT_WAIT_MS)
        jumpTo(anchor)
        busy.current = false
        return
      }

      transitioning.current = ENTER_DELAY_CURTAIN
      setActive(true)
      controls.set({ y: '-110%' })
      await controls.start({ y: '0%', transition: { duration: COVER_S, ease: EASE } })

      // Page is fully covered: swap route and reset scroll unseen.
      navigate(to, { state })
      jumpTo()
      await wait(MOUNT_WAIT_MS)
      jumpTo(anchor)

      await controls.start({ y: '110%', transition: { duration: REVEAL_S, ease: EASE } })
      setActive(false)
      transitioning.current = 0
      busy.current = false
    },
    [controls, navigate, reduce]
  )

  // Circle reveal: a green circle grows from the click point until it covers
  // the screen and names the destination; the route changes underneath, then
  // the circle shrinks back to the same point.
  const goReveal = useCallback(
    async (to, { x, y, label, anchor, state } = {}) => {
      if (busy.current) return
      if (reduce || x == null || y == null) {
        go(to, { anchor, state })
        return
      }
      busy.current = true
      transitioning.current = ENTER_DELAY_REVEAL

      // radius needed to reach the farthest screen corner from the click point
      const r = Math.ceil(
        Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
      )
      setReveal({ x, y, label })
      // let the overlay mount before animating it
      await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)))

      labelControls.start({ opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.35, ease: EASE } })
      await revealControls.start({
        clipPath: `circle(${r}px at ${x}px ${y}px)`,
        transition: { duration: EXPAND_S, ease: EASE },
      })

      // Fully covered: swap route and reset scroll unseen.
      navigate(to, { state })
      jumpTo()
      await wait(MOUNT_WAIT_MS)
      jumpTo(anchor)
      await wait(HOLD_MS)

      await labelControls.start({ opacity: 0, transition: { duration: 0.2 } })
      await revealControls.start({
        clipPath: `circle(0px at ${x}px ${y}px)`,
        transition: { duration: SHRINK_S, ease: EASE },
      })
      setReveal(null)
      transitioning.current = 0
      busy.current = false
    },
    [go, labelControls, navigate, reduce, revealControls]
  )

  const value = useMemo(
    () => ({ go, goReveal, transitioning, getEnterDelay: () => transitioning.current }),
    [go, goReveal]
  )

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
      <motion.div
        aria-hidden="true"
        initial={{ y: '-110%' }}
        animate={controls}
        className="flex items-center justify-center"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          top: -EDGE,
          bottom: -EDGE,
          zIndex: 100,
          background: '#14291F',
          borderRadius: `50% / ${EDGE}px`,
          visibility: active ? 'visible' : 'hidden',
          pointerEvents: active ? 'auto' : 'none',
        }}
      >
        <img
          src="/images/logo.webp"
          alt=""
          className="h-14 sm:h-16 w-auto object-contain brightness-0 invert opacity-90"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </motion.div>

      {reveal && (
        <motion.div
          aria-hidden="true"
          initial={{ clipPath: `circle(0px at ${reveal.x}px ${reveal.y}px)` }}
          animate={revealControls}
          className="flex items-center justify-center px-6 text-center"
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#14291F' }}
        >
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={labelControls}
            className="block text-[clamp(26px,5vw,44px)] leading-tight font-normal tracking-tight text-[#EFE0BC]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {reveal.label}
          </motion.span>
        </motion.div>
      )}
    </PageTransitionContext.Provider>
  )
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext)
  if (!ctx) throw new Error('usePageTransition must be used inside <PageTransitionProvider>')
  return ctx
}

/**
 * Seconds a page should wait before playing its own entrance animation.
 * Non-zero only when the page was reached through a transition overlay (so the
 * animation plays as the overlay lifts) and 0 on a normal first load.
 * Captured on first render so it never changes mid-animation.
 */
export function usePageEnterDelay() {
  const ctx = useContext(PageTransitionContext)
  const [delay] = useState(() => ctx?.getEnterDelay() || 0)
  return delay
}