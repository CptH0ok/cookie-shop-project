import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"  // The "name" attribute is used to access the value
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"  // The "name" attribute is used to access the value
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
      <GoogleSignIn />
    </div>
  );
};

export default Login;
