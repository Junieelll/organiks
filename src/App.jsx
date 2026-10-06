import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Replica Components
import ReplicaHeader from './components/replica/ReplicaHeader'
import ReplicaHome from './components/replica/ReplicaHome'
import ReplicaServices from './components/replica/ReplicaServices'
import ReplicaFooter from './components/replica/ReplicaFooter'
import { PageTransitionProvider } from './components/replica/PageTransition'

// Common Components
import FloatingProgressButton from './components/common/FloatingProgressButton'
import ProgressModal from './components/common/ProgressModal'
import ReplicaAbout from './components/replica/ReplicaAbout'
import ReplicaLocation from './components/replica/ReplicaLocation'

export default function App() {
  const [openProgress, setOpenProgress] = useState(false)

  return (
    <BrowserRouter>
      <PageTransitionProvider>
      <div className="min-h-dvh flex flex-col bg-white text-[#222]">
        <ReplicaHeader />

        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<ReplicaHome />} />
            <Route path="/services" element={<ReplicaServices />} />
            {/* <Route path="/about" element={<ReplicaAbout />} />
            <Route path="/location" element={<ReplicaLocation />} /> */}
          </Routes>
        </main>

        <ReplicaFooter />

        {/* Development Progress Tracker */}
        <FloatingProgressButton onClick={() => setOpenProgress(true)} />
        <AnimatePresence>
          {openProgress && <ProgressModal onClose={() => setOpenProgress(false)} />}
        </AnimatePresence>
      </div>
      </PageTransitionProvider>
    </BrowserRouter>
  )
}