import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'

// Replica Components
import ReplicaHeader from './components/replica/ReplicaHeader'
import ReplicaHome from './components/replica/ReplicaHome'
import ReplicaFooter from './components/replica/ReplicaFooter'

// Common Components
import FloatingProgressButton from './components/common/FloatingProgressButton'
import ProgressModal from './components/common/ProgressModal'

export default function App() {
  const [openProgress, setOpenProgress] = useState(false)

  return (
    <div className="min-h-dvh flex flex-col bg-white text-[#222]">
      <ReplicaHeader />

      <main className="flex-1 flex flex-col">
        <ReplicaHome />
      </main>

      <ReplicaFooter />

      {/* Development Progress Tracker */}
      <FloatingProgressButton onClick={() => setOpenProgress(true)} />
      <AnimatePresence>
        {openProgress && <ProgressModal onClose={() => setOpenProgress(false)} />}
      </AnimatePresence>
    </div>
  )
}
