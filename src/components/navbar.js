import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove token on logout
    navigate('/login');  // Redirect to login page
  };

  return (
    <nav className="bg-yellow-500 p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-white text-3xl font-bold">Cookie Shop</h1>
        <ul className="flex space-x-4">
          <li><Link to="/" className="text-white">Home</Link></li>
          <li><Link to="/shop" className="text-white">Shop</Link></li>
          <li><Link to="/maps" className="text-white">Maps</Link></li>
          <li><Link to="/reviews" className="text-white">Reviews</Link></li>
          <button onClick={handleLogout}>Logout</button>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
