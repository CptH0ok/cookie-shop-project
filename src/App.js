<<<<<<< HEAD
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './appcontent';
=======
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import HomePage from './pages/homepage';
import ShopPage from './pages/shoppage';
import AboutUsPage from './pages/aboutus';
import Reviews from './pages/reviews';
import Login from './pages/login';  // Login component
import Signup from './pages/signup';  // Signup component
import Maps from './pages/maps'
import ProtectedRoute from './components/ProtectedRoute';  // The protected route component
import LoginSuccess from './components/LoginSuccess';
import Admin from './pages/admin';
>>>>>>> c719019 (about us)

function App() {
  return (
    <Router>
<<<<<<< HEAD
      <AppContent />
=======
      <div className='w-full sticky top-0 z-20'>
        <Navbar />
      </div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/aboutus" element={<AboutUsPage />} />

        {/* Handle Google Login Success */}
        <Route path="/login/success" element={<LoginSuccess />} />

        {/* Protected Routes */}
        <Route path="/shop" element={<ProtectedRoute element={<ShopPage />} />} />
        <Route path="/maps" element={<ProtectedRoute element={<Maps />} />} />
        <Route path="/reviews" element={<ProtectedRoute element={<Reviews />} />} />
        <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />

        {/* Wildcard route: Let backend handle unhandled paths*/}
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
      <Footer />
>>>>>>> c719019 (about us)
    </Router>
  );
}

export default App;


