import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-yellow-500 p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-white text-3xl font-bold">Chocolate Truffle Shop</h1>
        <ul className="flex space-x-4">
          <li><Link to="/" className="text-white">Home</Link></li>
          <li><Link to="/shop" className="text-white">Shop</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
