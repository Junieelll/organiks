import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Layout & UI Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { PageTransitionProvider } from './components/common/PageTransition'

// Page Views
import Home from './pages/Home'
import Services from './pages/Services'
import About from './pages/About'
import Location from './pages/Location'
import PrivacyPolicy from './pages/PrivacyPolicy'

export default function App() {
  return (
    <BrowserRouter>
      <PageTransitionProvider>
        <div className="min-h-dvh flex flex-col bg-white text-[#222]">
          <Header />

          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/location" element={<Location />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </PageTransitionProvider>
    </BrowserRouter>
  )
}