import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import GoogleSignIn from '../components/GoogleSignIn';

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior

    // Get the form data directly from the input fields
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await axios.post('http://localhost:3000/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setError('');
      navigate('/');  // Redirect to home page after login
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className='relative flex flex-col z-10 min-h-screen h-auto'>
      <div className="flex min-h-full bg-unsplash-[ZS3OfU40CQU/lg] bg-no-repeat bg-cover bg-center flex-1 flex-col justify-center z-10 px-6 py-12 lg:px-8">
        <div class="absolute inset-0 bg-black bg-opacity-75 z-0"></div>
        <div className="z-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="z-10 flex justify-center w-full">
        <img
          src="https://img.icons8.com/fluency/48/cookies.png"
          className="z-10 sw-24 h-24 transition ease-in-out delay-150 drop-shadow-md hover:-translate-y-1 hover:scale-110 duration-300"
        ></img>
        <p className="z-10 pt-2 pl-1 text-6xl text-nowrap text-white drop-shadow-md font-serif font-bold">
          Cookie Land
        </p>
      </div>
          <h2 className="z-10 mt-10 text-center text-2xl font-bold leading-9 tracking-tight font-serif font-bold drop-shadow-md text-white">
            Log in to your account
          </h2>
        </div>
        <div className="z-10 mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm z-10 font-medium leading-6 text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-yellow-600 hover:text-yellow-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
            <form onSubmit={handleLogin}>
              <button
                type="submit"
                className="flex w-full justify-center mt-10 rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
              >
                Log in
              </button>
              {error && <p>{error}</p>}
              </form>
              <div className='mt-2'>
              <GoogleSignIn/>
              </div>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-semibold text-white">
            Not A Member?{' '}
            <Link to="/signup" className="font-semibold leading-6 text-yellow-600 hover:text-yellow-500 duration-300">
              Sign Up
            </Link>
          </p>
        </div>
      </div>      
    </div>
  );
};

export default Login;
