import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import TestHomePage from './pages/testhomepage';
import HomePage from './pages/homepage';
import ShopPage from './pages/shoppage';
import Reviews from './pages/reviews';

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<TestHomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/reviews" element={<Reviews />} />
      </Routes>
    </Router>
  );
}

export default App;
