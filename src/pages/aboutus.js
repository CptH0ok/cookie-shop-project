import React from 'react';
import './aboutus.css';

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content area */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Page title */}
        <h2 className="page-title">Our Story</h2>
        
        <div className="content-grid">
          <div className="image-container">
            {/* replace image */}
            <img src="/api/placeholder/600/400" alt="Our Story" className="w-full h-auto rounded-lg shadow-lg" />
          </div>
          
          <div className="text-content">
            <p className="mb-4">
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
          <p>&copy; 2024 Cookie Land. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;