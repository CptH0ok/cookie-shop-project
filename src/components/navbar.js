import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { XMarkIcon, TruckIcon, FingerPrintIcon, BanknotesIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {

    const parseUserDetails = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.get('/api/users/getuserdetails', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {setUserDetails(response.data)})
      .catch((err) => {
        console.log(err);
        localStorage.removeItem("token"); // Token is invalid
      });
    }
  }

  parseUserDetails();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    setUserDetails(null);
    navigate("/"); // Redirect to login page
  };

  const renderUserCircle = () => {
    if (userDetails?.picture) {
      return (
        <img src={userDetails.picture} alt="profile" className="w-7 h-7 bg-gray-500 text-white rounded-full" />
    );
    }
    const initials = userDetails?.name.split(" ").map(n => n[0]).join("");
    return (
      <div className="w-7 h-7 bg-gray-500 text-white rounded-full">
        {initials}
      </div>
    );
  };
  
  // Function to focus or style the button
  const handleButtonClick = () => {
    navigate("/login");
    };  

  const solutions = [
    { name: 'Cart', description: 'See your cart', href: '#cart', icon: TruckIcon },
    { name: 'Purchase History', description: 'List all of your past purchases', href: '#phistory', icon: BanknotesIcon },
    { name: 'Security', description: "Change your E-Mail or Password", href: '#security', icon: FingerPrintIcon },,
  ]
  const callsToAction = [
    { name: 'Contact sales', href: '#', icon: PhoneIcon },
  ]

  return (
    <nav className="flex absolute backdrop-blur-md backdrop-contrast-75 pt-3 pb-2 z-20 w-full drop-shadow-2xl">
      <button className="flex pl-4" onClick={() => setOpen(true)}>
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
      </button>
      <div className="flex justify-center w-full">
        <img
          src="https://img.icons8.com/fluency/48/cookies.png"
          className="ml-5 w-14 h-14 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
        ></img>
        <p className="pt-2 pl-1 text-4xl text-white font-serif font-bold">
          Cookie Land
        </p>
      </div>

      {/* Auth Buttons */}
      {userDetails ? (
        <div className="flex items-center mr-4 w-50">
          <Popover className="relative">
          <PopoverButton className="items-center justify-center mr-4 mt-2 relative flex z-10 h-10 w-40 rounded-md ring-1 text-white/70 stroke-white/30 ring-white/30 bg-white/5 duration-500 hover:ring-white hover:stroke-black hover:text-black hover:bg-white px-2.5 py-2.5 drop-shadow-md duration-500">
              {renderUserCircle()}
          <a className="text-sm font-sans text-nowrap font-semibold">Profile</a>
          <ChevronDownIcon aria-hidden="true" className="h-5 w-5" />
          </PopoverButton>
          <PopoverPanel
        transition
        className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-sm -translate-x-1/2 px-4 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="w-screen max-w-md flex-auto overflow-hidden rounded-2xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
          <div className="p-4">
            {solutions.map((item) => (
              <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                  <item.icon aria-hidden="true" className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" />
                </div>
                <div>
                  <a onClick={handleButtonClick} href={item.href} className="font-semibold text-gray-900">
                    {item.name}
                    <span className="absolute inset-0" />
                  </a>
                  <p className="mt-1 text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
            {callsToAction.map((item) => (
              <a 
                key={item.name}
                href={item.href}
                className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
              >
                <item.icon aria-hidden="true" className="h-5 w-5 flex-none text-gray-400" />
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </PopoverPanel>
      </Popover>


          <button onClick={handleLogout} className="mr-4 mt-2 relative flex z-10 h-10 rounded-md bg-red-600 text-white stroke-white  duration-500 hover:bg-red-300 hover:backdrop-contrast-75 px-2.5 py-2.5 drop-shadow-md duration-500">
          <svg
            class="size-6 pb-1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
            />
          </svg>
          <a className="text-sm font-sans text-nowrap font-semibold">Logout</a>
          </button>
        </div>
      ) : (
        <>
          <Link
        to={"/Signup"}
        className="mr-4 mt-2 relative flex z-10 h-10 rounded-md bg-yellow-600 text-white stroke-white  duration-500 hover:bg-yellow-500 hover:backdrop-contrast-75 px-2.5 py-2.5 drop-shadow-md duration-500"
      >
        <svg
          class="size-6 pb-1"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
          />
        </svg>

        <a className="text-sm font-sans text-nowrap font-semibold">Sign Up</a>
      </Link>
          <Link to={"/login"}
        className="mr-4 mt-2 relative flex z-10 h-10 rounded-md ring-1 text-white/70 stroke-white/30 ring-white/30 bg-white/5 duration-500 hover:ring-white hover:stroke-black hover:text-black hover:bg-white px-2.5 py-2.5 drop-shadow-md duration-500"
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
        <a className="text-sm font-sans font-semibold">Login</a>
      </Link>
        </>
      )}


      <Dialog open={open} onClose={setOpen} className="relative z-20">
      <DialogBackdrop
        transition
        className="fixed inset-0 backdrop-blur-2xl bg-contrast-75 transition-opacity drop-shadow-2xl duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full ">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-xs transform transition duration-500 ease-in-out data-[closed]:-translate-x-full sm:duration-500"
            >
              <TransitionChild>
                <div className="absolute right-2 top-0 -ml-8 flex pl-2 pt-2 duration-500 ease-in-out data-[closed]:opacity-0 sm:-mr-10 sm:pl-0">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex h-full flex-col overflow-y-scroll bg-black py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <DialogTitle className="text-base font-semibold leading-6 text-white">Panel title</DialogTitle>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">{/* Your content */}</div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
    </nav>
  );
};

export default Navbar;
