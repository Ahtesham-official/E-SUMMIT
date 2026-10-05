import React, { useState } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhatToExpect from './components/WhatToExpect'
import Speakers from './components/Speakers'
import ScheduleAndPartners from './components/ScheduleAndPartners'
import LoadingScreen from './components/LoadingScreen'
import RegistrationModal from './components/RegistrationModal'
import { AuthProvider } from './context/AuthContext'

const App = () => {
  const [loading, setLoading] = useState(true)
  const [regOpen, setRegOpen] = useState(false)

  return (
    <AuthProvider>
      <div className='w-full overflow-x-hidden scroll-smooth font-sans bg-[#E8DDDC]'>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

        <Navbar
          animate={!loading}
          onRegisterClick={() => setRegOpen(true)}
        />

        <main>
          <Hero animate={!loading} onRegisterClick={() => setRegOpen(true)} />
          <WhatToExpect />
          <Speakers />
          <ScheduleAndPartners />
        </main>

        <RegistrationModal
          isOpen={regOpen}
          onClose={() => setRegOpen(false)}
        />
      </div>
    </AuthProvider>
  )
}
export default App