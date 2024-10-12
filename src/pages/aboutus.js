import React from 'react';
import { Menu } from 'lucide-react';

const AboutUs = () => {
  // State to manage mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Function to toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
          
          {/* Text content column */}
          <div>
            {/* Paragraphs describing your brand story */}
            <p className="text-lg mb-4">
              Founded in 2024, Cookie Land began with a simple idea: to create the most delicious cookies possible. Our journey started in a small kitchen, experimenting with recipes and flavors until we perfected our signature taste.
            </p>
            <p className="text-lg mb-4">
              Today, we're proud to serve customers across Israel, bringing joy through our handcrafted cookies. Our commitment to quality ingredients and innovative flavors remains at the heart of everything we do.
            </p>
            <p className="text-lg">
              Join us in our story as we continue to grow, innovate, and spread happiness, one cookie at a time.
            </p>
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