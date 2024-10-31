import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Store the token in localStorage or wherever you manage auth tokens
      localStorage.setItem('token', token);

      // Redirect the user to the homepage or dashboard
      navigate('/');
    } else {
      // If there's no token, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  return <h2>Login Successful, Redirecting...</h2>;
};

export default LoginSuccess;
