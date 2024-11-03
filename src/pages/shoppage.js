import './shoppage.css';
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const ShopPage = () => {
  const navigate = useNavigate();
  const [cookies, setCookies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stockStatus, setStockStatus] = useState("");
  const [filteredCookies, setFilteredCookies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    // Fetch all cookies from the server
    fetch("http://localhost:3001/api/cookies")
      .then((response) => response.json())
      .then((data) => {
        setCookies(data);
        setFilteredCookies(data);

        // Extract unique categories for the filter bar
        const uniqueCategories = [...new Set(data.map((cookie) => cookie.category))];
        setCategories(uniqueCategories);
      });
  }, []);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    filterCookies(category, stockStatus);
  };

  const handleStockStatusChange = (event) => {
    const stock = event.target.value;
    setStockStatus(stock);
    filterCookies(selectedCategory, stock);
  };

  const filterCookies = (category, stock) => {
    let filtered = cookies;

    if (category) {
      filtered = filtered.filter((cookie) => cookie.category === category);
    }

    if (stock) {
      filtered = filtered.filter((cookie) =>
        stock === "inStock" ? cookie.available : !cookie.available
      );
    }

    setFilteredCookies(filtered);
  };

  const handleCookieClick = (cookieName) => {
    const encodedName = encodeURIComponent(cookieName);
    navigate(`/cookie/${encodedName}`);
  };

  return (
    <div className="shop-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-wrapper">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-sm font-medium text-gray-400 hover:text-gray-500">
                Home
              </Link>
            </li>
            <li>
              <svg
                className="h-5 w-5 text-gray-600 mx-2"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
              </svg>
            </li>
            <li className="text-sm font-medium text-gray-500">Shop</li>
          </ol>
        </nav>
      </div>

      <header className="header">
        <h1 className="relative text-balance z-10 text-white text-4xl font-bold font-serif tracking-tight sm:text-6xl">
          Explore Our Delicious Cookies
        </h1>
        <p className="relative z-10 mt-6 text-lg leading-8 text-white font-serif">
          From classic favorites to unique creations, find your perfect cookie in our wide variety.
        </p>
      </header>

      {/* Filter Bar */}
      <div className="filter-bar">
        <label htmlFor="category-filter">Category: </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <label htmlFor="stock-filter">Stock Status: </label>
        <select
          id="stock-filter"
          value={stockStatus}
          onChange={handleStockStatusChange}
        >
          <option value="">All</option>
          <option value="inStock">In Stock</option>
          <option value="outOfStock">Out of Stock</option>
        </select>
      </div>

      {/* Cookie List */}
      <div className="cookie-list">
        {filteredCookies.length > 0 ? (
          filteredCookies.map((cookie) => (
            <div
              key={cookie.name}
              className="cookie-card"
              onClick={() => handleCookieClick(cookie.name)}
            >
              <img src={cookie.imageUrl} alt={cookie.name} className="cookie-image" />
              <h2>{cookie.name}</h2>
              <p className="cookie-description">{cookie.description}</p>
              <p className="cookie-price">Price: ${cookie.price}</p>
              <p className="cookie-category">Category: {cookie.category}</p>
              <p className={`cookie-stock ${cookie.available ? "in-stock" : "out-of-stock"}`}>
                {cookie.available ? "In Stock" : "Out of Stock"}
              </p>
            </div>
          ))
        ) : (
          <p>No cookies available for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
