import React from "react";
import error from "../assets/error.png"
import bg from "../assets/errbg.png"
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="relative pt-2 left-0 min-h-screen" style={{
      backgroundImage: `url(${bg})`, // Use the imported image here
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }}>
      <div className="flex mt-12 justify-center items-center h-20">
        <img src={error} alt="Error" className="max-w-xs" />
      </div>
      <h1 className="relative mt-6 text-center text-balance text-white text-4xl font-bold font-serif tracking-tight drop-shadow-2xl sm:text-6xl">
                  Oops! The Oven’s Empty!
      </h1>
      <p className="relative mt-1 text-lg text-center leading-8 text-white drop-shadow-2xl font-serif">
            Looks like this page doesn’t exist anymore. Maybe it got eaten? Why not check out <Link to={"/"} className="inline underline underline-offset-2 hover:text-yellow-500 duration-300" >
            our latest cookie flavors instead!
      </Link>
      </p>


    </div>
  );
};

export default ErrorPage;
