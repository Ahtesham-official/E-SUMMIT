import React, { useState } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WhatToExpect from './components/WhatToExpect'
import Speakers from './components/Speakers'
import ScheduleAndPartners from './components/ScheduleAndPartners'
import LoadingScreen from './components/LoadingScreen'

const App = () => {
  const [loading, setLoading] = useState(true)

  return ( 
    <div className='w-full overflow-x-hidden scroll-smooth font-sans bg-[#E8DDDC]'>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <Navbar animate={!loading} />
      <main>
        <Hero animate={!loading} />
        <WhatToExpect />
        <Speakers />
        <ScheduleAndPartners />
      </main>
    </div> 
  )
}
export default App