import React from 'react'
import Hero from '@/components/ui/Hero'
import Navbar from '@/components/ui/Navbar'
import Features from '@/components/ui/Features'
import Footer from '@/components/ui/Footer'


const Home = () => {
  return (
    <div className="bg-[#2bff0027] w-full min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
      
      
    </div>
  )
}

export default Home