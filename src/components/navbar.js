import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="flex absolute backdrop-blur-md backdrop-contrast-75 pt-3 pb-2 z-20 w-full drop-shadow-2xl">
      <div className="flex pl-4">
        <svg
          class="size-12 stroke-white/30 hover:stroke-white duration-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </div>
      <div className="flex justify-center w-full">
        <img
          src="https://img.icons8.com/fluency/48/cookies.png"
          className="ml-5 w-14 h-14 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
        ></img>
        <p className="pt-2 pl-1 text-4xl text-white font-serif font-bold">
          Cookie Land
        </p>
      </div>
      <button
        href="#"
        className="mr-4 mt-2 relative flex z-10 h-10 rounded-md ring-1 text-white/30 stroke-white/30 ring-white/30 duration-500 hover:ring-white hover:stroke-white hover:text-white hover:backdrop-contrast-75 px-2.5 py-2.5 drop-shadow-md duration-500"
      >
        <a className="text-sm font-sans font-semibold">Sign Up</a>
      </button>
      <button
        href="#"
        className="mr-4 mt-2 relative flex z-10 h-10 rounded-md ring-1 text-white/30 stroke-white/30 ring-white/30 duration-500 hover:ring-white hover:stroke-white hover:text-white hover:backdrop-contrast-75 px-2.5 py-2.5 drop-shadow-md duration-500"
      >
        <svg
          class="pb-1 size-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
          />
        </svg>
        <a className="text-sm font-sans font-semibold">
          {" "}
          <Link to={"/login"}>Login</Link>
        </a>
      </button>
    </nav>
  );
};

export default Navbar;
