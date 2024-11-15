"use client";

import shelly from "../assets/shelly.jpg"
import eitan from "../assets/eitan.jpg"
import adi from "../assets/adi.jpg"
import yam from "../assets/yam.jpg"

const AboutUs = () => {
  return (
    <div className="relative flex flex-col z-10 min-h-screen h-auto">
      <div className="relative bg-unsplash-[1Gv_4RcljOE/lg] bg-no-repeat bg-cover z-10">
        <div className="absolute inset-0 bg-black bg-opacity-75 z-0"></div>
        <div className="mx-auto max-w-2xl mt-10 sm:py-48 lg:py-36">
          <div className="text-center">
            <h1 className="relative text-balance z-10 text-white text-4xl font-bold font-serif tracking-tight sm:text-6xl}">About Cookie Land</h1>
            <p className="relative z-10 mt-6 text-lg leading-8 text-white font-serif">
              Discover the story behind our passion for baking and our commitment to bringing joy through every cookie we create.
            </p>
          </div>
        </div>
      </div>
      <div className="2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="w-full lg:w-5/12 flex flex-col justify-center">
                  <h1 className="relative mb-2 text-balance z-10 text-black text-4xl font-bold font-serif tracking-tight sm:text-5xl">About Us</h1>
                  <p className="font-serif text-base leading-6 text-gray-600"> At Cookie Land, we believe in using only the finest ingredients, supporting local suppliers, and creating a warm, welcoming environment for our customers. Our commitment to quality and community is baked into every cookie we make.</p>
              </div>
              <div className="w-full lg:w-8/12 ">
                  <img className="w-full h-full" src="https://images.unsplash.com/photo-1464979681340-bdd28a61699e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="A shop" />
              </div>
          </div>

          <div className="flex lg:flex-row flex-col justify-between gap-8 pt-12">
              <div className="w-full lg:w-5/12 flex flex-col justify-center">
                  <h1 className="relative mb-2 text-balance z-10 text-black text-4xl font-bold font-serif tracking-tight sm:text-5xl">Our Story</h1>
                  <p className="font-serif text-base leading-6 text-gray-600">
                    Cookie Land was born from a simple love for homemade cookies. What started as weekend baking sessions for friends and family in 2023 quickly grew into the beloved cookie shop you know today. Our founder, Jane Doe, turned her passion into a mission: to spread happiness one cookie at a time.
                    </p>
              </div>
              <div className="w-full lg:w-8/12 lg:pt-8">
                  <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-4 shadow-lg rounded-md">
                      <div className="p-4 pb-6 flex justify-center flex-col items-center">
                          <img className="md:block hidden" src={yam} alt="yam Img" />
                          <img className="md:hidden block" src={yam} alt="yam Img" />
                          <p className="font-serif text-xl leading-5 text-gray-800 mt-4">Yam</p>
                      </div>
                      <div className="p-4 pb-6 flex justify-center flex-col items-center">
                          <img className="md:block hidden" src={adi} alt="adi Img" />
                          <img className="md:hidden block" src={adi} alt="di Img" />
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
      </div>
  );
};


export default AboutUs;