import React from 'react';
import './aboutus.css';

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header section */}
      <header className="bg-pink-100 p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Brand logo/name */}
          <h1 className="text-3xl font-bold text-pink-600">Your Brand</h1>
          
          {/* Mobile menu toggle button */}
          <button onClick={toggleMenu} className="md:hidden">
            <Menu size={24} />
          </button>
          
          {/* Navigation menu */}
          <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
            <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              {/* Navigation items */}
              <li><a href="#" className="text-pink-600 hover:text-pink-800">Home</a></li>
              <li><a href="#" className="text-pink-600 hover:text-pink-800">Our Story</a></li>
              <li><a href="#" className="text-pink-600 hover:text-pink-800">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Page title */}
        <h2 className="text-4xl font-bold text-center mb-8">Our Story</h2>
        
        {/* Two-column grid for content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image column */}
          <div>
            {/* Placeholder image - replace with your actual image */}
            <img src="/api/placeholder/600/400" alt="Our Story" className="w-full h-auto rounded-lg shadow-lg" />
          </div>

          <div className="flex lg:flex-row flex-col justify-between gap-8 pt-12">
              <div className="w-full lg:w-5/12 flex flex-col justify-center">
                  <h1 className="title_black">Our Story</h1>
                  <p className="paragraph_small">
                    Cookie Land was born from a simple love for homemade cookies. What started as weekend baking sessions for friends and family in 2023 quickly grew into the beloved cookie shop you know today. Our founder, Jane Doe, turned her passion into a mission: to spread happiness one cookie at a time.
                    </p>
              </div>
              <div className="w-full lg:w-8/12 lg:pt-8">
                  <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-4 shadow-lg rounded-md">
                      <div className="p-4 pb-6 flex justify-center flex-col items-center">
                          <img className="md:block hidden" src="https://i.ibb.co/FYTKDG6/Rectangle-118-2.png" alt="Alexa featured Img" />
                          <img className="md:hidden block" src="https://i.ibb.co/zHjXqg4/Rectangle-118.png" alt="Alexa featured Img" />
                          <p className="font-serif text-xl leading-5 text-gray-800 mt-4">Yam</p>
                      </div>
                      <div className="p-4 pb-6 flex justify-center flex-col items-center">
                          <img className="md:block hidden" src="https://i.ibb.co/fGmxhVy/Rectangle-119.png" alt="Olivia featured Img" />
                          <img className="md:hidden block" src="https://i.ibb.co/NrWKJ1M/Rectangle-119.png" alt="Olivia featured Img" />
                          <p className="font-serif text-xl leading-5 text-gray-800 mt-4">Adi</p>
                      </div>
                      <div className="p-4 pb-6 flex justify-center flex-col items-center">
                          <img className="md:block hidden" src={eitan} alt="eitan Img" />
                          <img className="md:hidden block" src={eitan} alt="eitan Img" />
                          <p className="font-serif text-xl leading-5 text-gray-800 mt-4">Eitan</p>
                      </div>
                      <div className="p-4 pb-6 flex justify-center flex-col items-center">
                          <img className="md:block hidden" src={shelly} alt="shelly img" />
                          <img className="md:hidden block" src={shelly} alt="shellys img" />
                          <p className="font-serif text-xl leading-5 text-gray-800 mt-4">Shelly</p>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </main>

      {/* Footer section */}
      <footer className="bg-pink-100 p-4 mt-8">
        <div className="container mx-auto text-center text-pink-600">
          {/* Copyright notice */}
          <p>&copy; 2024 Your Brand. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};


export default AboutUs;