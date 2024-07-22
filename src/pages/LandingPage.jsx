import React from 'react'
import { FaPaintBrush, FaBullhorn, FaGlobe, FaPenFancy } from 'react-icons/fa';
import ServiceCard from '../components/Landingpage/ServiceCard';
const LandingPage = () => {
  return (
    <div>
       <header className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-center h-[100vh] py-8">
      <div className="container mx-auto w-full">
        <h1 className="text-9xl font-bold">Nimantran Digital Designs demo</h1>
        <p className="mt-4">We are a one-stop solution for all your design needs.</p>
      </div>
    </header>
   
    <section className="py-16 bg-gradient-to-r from-yellow-500 to-pink-500">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <ServiceCard
          title="Brand Design"
          description="Logos, logo marks, logo types, brand identity & more!"
          icon={<FaPaintBrush />}
        />
        <ServiceCard
          title="Graphic Design"
          description="Business cards, letterheads, brochures, presentations, & more!"
          icon={<FaPenFancy />}
        />
        <ServiceCard
          title="Social Media Design"
          description="Social media posts, stories, videos, reels & more!"
          icon={<FaBullhorn />}
        />
        <ServiceCard
          title="Web Design"
          description="E-commerce, professional, blogging websites & more!"
          icon={<FaGlobe />}
        />
      </div>
    </section>
    <section className="py-16 bg-white text-center">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4">LITTLE about us</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-8">
          At Nimantran, we strive to add the magic ingredient of ‘love’ to the recipe of design to make it stand out!
          <br />
          What started as a passion project for two best friends when the world was in lockdown, has grown into a collaborative design studio.
          <br />
          We believe that design is indispensable when it comes to communicating who we are & what we value. We ideate, deliberate & create visual assets that complement your marketing efforts.
          <br />
          Our business verticals broadly include: brand design, graphic design, social media design & web design.
        </p>
      </div>
    </section>
    </div>
  )
}

export default LandingPage
