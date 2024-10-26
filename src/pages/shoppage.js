// client/src/components/shopPage.js : for the actual shopping page
"use client";

import { useState, useEffect } from "react";
import './shoppage.css';

const ShopPage = () => {
  const [cookies, setCookies] = useState([]);

  useEffect(() => {
    // Fetch cookies from the server
    fetch("http://localhost:3001/api/cookies")
      .then((response) => response.json())
      .then((data) => setCookies(data));
  }, []);

  return (
    <div className="relative flex flex-col z-10 min-h-screen h-auto">
      <div className="relative bg-unsplash-[unsplash-keyword-image] bg-no-repeat bg-cover z-10">
        <div className="absolute inset-0 bg-black bg-opacity-75 z-0"></div>
        <div className="mx-auto max-w-2xl mt-10 sm:py-48 lg:py-36">
          <div className="text-center">
            <h1 className="relative text-balance z-10 text-white text-4xl font-bold font-serif tracking-tight sm:text-6xl">
              Explore Our Delicious Cookies
            </h1>
            <p className="relative z-10 mt-6 text-lg leading-8 text-white font-serif">
              From classic favorites to unique creations, find your perfect cookie in our wide variety.
            </p>
          </div>
        </div>
      </div>

      {/* Cookie List Section */}
      <div className="relative bg-black py-20">
        <div className="flex flex-wrap justify-center mx-10">
          {cookies.map((cookie) => (
            <div key={cookie.id} className="bg-white w-80 m-5 p-5 rounded-md shadow-md text-center">
              <img src={cookie.imageUrl} alt={cookie.name} className="w-full h-48 object-cover mb-5 rounded-md" />
              <h2 className="text-2xl font-bold font-serif mb-3">{cookie.name}</h2>
              <p className="text-lg font-serif mb-2">{cookie.description}</p>
              <p className="text-yellow-600 font-semibold mb-2">${cookie.price}</p>
              <p className="text-sm font-serif text-gray-600">Category: {cookie.category}</p>
              <p className="text-sm font-serif text-green-600">{cookie.available ? "In Stock" : "Out of Stock"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="relative bg-black h-auto">
        <div className="flex h-auto">
          <h1 className="bg-black w-1/2 h-auto pt-12 text-center text-balance text-white text-6xl font-serif font-bold">
            Freshly Baked
            <p className="text-2xl mt-4 ml-10 mr-10 mb-10 text-center text-pretty font-serif font-light tracking-tight">
              At Cookie Land, we bake happiness into every bite! From classic
              chocolate chip to indulgent double fudge and unique seasonal
              flavors, our cookies are handcrafted daily using the finest
              ingredients.
            </p>
          </h1>
          <div className="relative right-0 bg-unsplash-[unsplash-second-image] bg-cover bg-center bg-no-repeat w-1/2 h-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
