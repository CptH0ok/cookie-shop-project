import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import HomePage from './pages/homepage';
import ShopPage from './pages/shoppage';
import Reviews from './pages/reviews';
import Login from './pages/login';  // Login component
import Signup from './pages/signup';  // Signup component
import ProtectedRoute from './components/ProtectedRoute';  // The protected route component

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/shop" element={<ProtectedRoute element={<ShopPage />} />} />
        <Route path="/reviews" element={<ProtectedRoute element={<Reviews />} />} />

        {/* Wildcard route: Let backend handle unhandled paths like /auth/google */}
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
