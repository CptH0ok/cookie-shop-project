import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleSignup = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post('http://localhost:3000/signup', { email, password, name });
        localStorage.setItem('token', res.data.token);
        setError('');
        navigate('/')
        // Redirect to protected page
      } catch (err) {
        setError('Error creating account');
      }
    };
  
    return (
      <div>
        <h2>Signup</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Signup</button>
          {error && <p>{error}</p>}
        </form>
      </div>
    );
  };
  
  export default Signup;
  