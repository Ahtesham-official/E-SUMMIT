import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhatToExpect from './components/WhatToExpect'
import Speakers from './components/Speakers'
import ScheduleAndPartners from './components/ScheduleAndPartners'
import LoadingScreen from './components/LoadingScreen'
import RegistrationModal from './components/RegistrationModal'
import AllSpeakersPage from './components/AllSpeakersPage'
import MyTicketsPage from './components/MyTicketsPage'
import AdminDashboard from './components/admin/AdminDashboard'
import BackgroundCircles from './components/BackgroundCircles'
import { AuthProvider } from './context/AuthContext'

const MainPage = ({ loading, setRegOpen }) => (
  <main>
    <Hero animate={!loading} onRegisterClick={() => setRegOpen(true)} />
    <WhatToExpect />
    <Speakers />
    <ScheduleAndPartners />
  </main>
)

const App = () => {
  const [loading, setLoading] = useState(true)
  const [regOpen, setRegOpen] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return (
    <AuthProvider>
      <div className='relative w-full overflow-x-hidden scroll-smooth font-sans bg-[#E8DDDC] min-h-screen'>
        <BackgroundCircles />
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

        <Navbar
          animate={!loading}
          onRegisterClick={() => setRegOpen(true)}
        />

        <Routes>
          <Route path="/" element={<MainPage loading={loading} setRegOpen={setRegOpen} />} />
          <Route path="/speakers" element={<AllSpeakersPage />} />
          <Route path="/my-tickets" element={<MyTicketsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>


        <RegistrationModal
          isOpen={regOpen}
          onClose={() => setRegOpen(false)}
        />
      </div>
    </AuthProvider>
  )
}
export default App