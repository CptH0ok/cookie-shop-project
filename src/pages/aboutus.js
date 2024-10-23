"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const AboutUsPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="relative flex flex-col z-10 min-h-screen h-auto">
      <div className="relative bg-unsplash-[1Gv_4RcljOE/lg] bg-no-repeat bg-cover z-10">
        <div className="absolute inset-0 bg-black bg-opacity-75 z-0"></div>
        <div className="mx-auto max-w-2xl mt-10 sm:py-48 lg:py-36">
          <div className="text-center">
            <h1 className="relative text-balance z-10 text-white text-4xl font-bold font-serif tracking-tight sm:text-6xl">
              About Cookie Land
            </h1>
            <p className="relative z-10 mt-6 text-lg leading-8 text-white font-serif">
              Discover the story behind our passion for baking and our commitment to bringing joy through every cookie we create.
            </p>
          </div>
        </div>
      </div>
      <body className="relative bg-black h-auto">
        <div className="flex h-auto">
          <h1 className="bg-black w-1/2 h-auto pt-12 text-center text-balance text-white text-6xl font-serif font-bold">
            Our Story
            <p className="text-2xl mt-4 ml-10 mr-10 mb-10 text-center text-pretty font-serif font-light tracking-tight">
              Cookie Land was born from a simple love for homemade cookies. What started as weekend baking sessions for friends and family in 2010 quickly grew into the beloved cookie shop you know today. Our founder, Jane Doe, turned her passion into a mission: to spread happiness one cookie at a time.
            </p>
          </h1>
          <div className="relative right-0 bg-unsplash-[AO_6utzivow/sm] bg-cover bg-center bg-no-repeat w-1/2 h-auto"></div>
        </div>
        <div className="flex h-auto">
        <div className="relative left-0 bg-unsplash-[wQ9VuP_Njr4/sm] bg-cover bg-bottom bg-no-repeat w-1/2 h-auto"></div>
          <h1 className="bg-black w-1/2 h-auto pt-12 text-center text-balance text-white text-6xl font-serif font-bold">
            Our Values
            <p className="text-2xl mt-4 ml-10 mr-10 mb-10 text-center text-pretty font-serif font-light tracking-tight">
              At Cookie Land, we believe in using only the finest ingredients, supporting local suppliers, and creating a warm, welcoming environment for our customers. Our commitment to quality and community is baked into every cookie we make.
            </p>
          </h1>
        </div>
        <div className="flex h-auto">
          <h1 className="bg-black w-1/2 h-auto pt-12 text-center text-balance text-white text-6xl font-serif font-bold">
          Meet Our Team
            <p className="text-2xl mt-4 ml-10 mr-10 mb-10 text-center text-pretty font-serif font-light tracking-tight">
              From our skilled bakers to our friendly staff, every member of the Cookie Land family plays a crucial role in bringing you the perfect cookie experience. We're united by our love for baking and our dedication to customer satisfaction.
            </p>
          </h1>
          <div className="relative right-0 bg-unsplash-[Hli3R6LKibo/sm] bg-cover bg-top bg-no-repeat w-1/2 h-auto"></div>
        </div>
      </body>
    </div>
  );
};

export default AboutUsPage;