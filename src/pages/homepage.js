"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom"; // for redirection 

const HomePage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const handleOrderNowClick = () => {
    navigate("https://localhost:3000/shop"); // Redirect to /shop when the button is clicked
  };
  return (
    <div className="relative flex flex-col z-10 min-h-screen h-auto">
      <div className="relative bg-unsplash-[1Gv_4RcljOE/lg] bg-no-repeat bg-cover z-10">
        <div class="absolute inset-0 bg-black bg-opacity-75 z-0"></div>
        <div className="mx-auto max-w-2xl mt-10 sm:py-48 lg:py-36">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="text-white relative rounded-full px-3 py-1 z-10 text-base font-serif leading-6 ring-1 ring-white/10 hover:ring-white/20">
              New Gluten Free Options!{" "}
              <a href="/glutenfree" className="font-semibold font-serif text-yellow-600">
                <span aria-hidden="true" className="absolute inset-0" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1 className="relative text-balance z-10 text-white text-4xl font-bold font-serif tracking-tight sm:text-6xl">
              Baking Hapiness, One Cookie at a Time.
            </h1>
            <p className="relative z-10 mt-6 text-lg leading-8 text-white font-serif">
              Our cookies are baked fresh throughout the day to ensure every
              bite is warm and soft, just like they came out of your oven.
              Whether you visit us in-store or order online, you’ll always enjoy
              cookies at peak deliciousness.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="/shop"
                className="relative z-10 rounded-md bg-yellow-600 px-3.5 py-2.5 text-base font-serif duration-500 font-semibold text-white drop-shadow-md hover:bg-yellow-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
              >
                Order Now
              </a>
              <a
                href="#"
                className="relative z-10 ext-sm font-semibold leading-6 font-serif text-white"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        ></div>
      </div>
      <body className="relative bg-black h-auto">
        <div className="flex h-auto">
          <h1 className="bg-black w-1/2 h-auto pt-12 text-center text-balance text-white text-6xl font-serif font-bold">
            Freshly Baked
            <p className="text-2xl mt-4 ml-10 mr-10 mb-10 text-center text-pretty font-serif font-light tracking-tight">
              At Cookie Land, we bake happiness into every bite! From classic
              chocolate chip to indulgent double fudge and unique seasonal
              flavors, our cookies are handcrafted daily using the finest
              ingredients. Whether you're grabbing a quick treat for yourself or
              a box to share, we have something for everyone to enjoy. Explore
              our menu and order your favorite cookies today!
            </p>
          </h1>
          <div className="relative right-0 bg-unsplash-[AO_6utzivow/sm] bg-cover bg-center bg-no-repeat w-1/2 h-auto"></div>
        </div>
        <div className="flex h-auto">
        <div className="relative left-0 bg-unsplash-[wQ9VuP_Njr4/sm] bg-cover bg-bottom bg-no-repeat w-1/2 h-auto"></div>
          <h1 className="bg-black w-1/2 h-auto pt-12 text-center text-balance text-white text-6xl font-serif font-bold">
            Made Fresh, Delivered Fast
            <p className="text-2xl mt-4 ml-10 mr-10 mb-10 text-center text-pretty font-serif font-light tracking-tight">
              Can't stop by? No worries! We offer same-day delivery to satisfy your cookie cravings. Freshly baked, right to your doorstep.
            </p>
          </h1>
        </div>
        <div className="flex h-auto">
          <h1 className="bg-black w-1/2 h-auto pt-12 text-center text-balance text-white text-6xl font-serif font-bold">
          Custom Orders for Special Occasions
            <p className="text-2xl mt-4 ml-10 mr-10 mb-10 text-center text-pretty font-serif font-light tracking-tight">
              From birthdays to corporate events, we’ll help make your celebrations a little sweeter with personalized cookie boxes, gift sets, and more.
            </p>
          </h1>
          <div className="relative right-0 bg-unsplash-[Hli3R6LKibo/sm] bg-cover bg-top bg-no-repeat w-1/2 h-auto"></div>
        </div>
      </body>
    </div>
  );
};

export default HomePage;
