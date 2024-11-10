"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './shoppage.css';

const ShopPage = () => {
  const [cookies, setCookies] = useState([]);
  const [filteredCookies, setFilteredCookies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cookies from your cookie API
    fetch("http://localhost:3001/api/cookies")
      .then((response) => response.json())
      .then((data) => {
        setCookies(data);
        setFilteredCookies(data);

        // Set unique categories for filter dropdown
        const uniqueCategories = [...new Set(data.map((cookie) => cookie.category))];
        setCategories(uniqueCategories);
      });

    // Fetch cookie counts grouped by category from the backend
    fetch("http://localhost:3001/api/cookies/group-by-category")
      .then((response) => response.json())
      .then((data) => {
        setCategoryCounts(data); // Store the category counts for display
      });
  }, []);

  const handlePriceRangeChange = (event) => {
    const range = event.target.value;
    setPriceRange(range);
    applyFilters(range, selectedCategory, stockStatus);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    applyFilters(priceRange, category, stockStatus);
  };

  const handleStockStatusChange = (event) => {
    const stock = event.target.value;
    setStockStatus(stock);
    applyFilters(priceRange, selectedCategory, stock);
  };

  // Apply all selected filters (price, category, stock)
  const applyFilters = (range, category, stock) => {
    let filtered = cookies;

    // Filter by price range
    if (range) {
      filtered = filtered.filter((cookie) => {
        if (range === "Below $2") return cookie.price < 2;
        if (range === "$2 - $3") return cookie.price >= 2 && cookie.price <= 3;
        if (range === "Above $3") return cookie.price > 3;
        return true;
      });
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter((cookie) => cookie.category === category);
    }

    // Filter by stock status (inStock or outOfStock)
    if (stock) {
      filtered = filtered.filter((cookie) =>
        stock === "inStock" ? cookie.available : !cookie.available
      );
    }

    // Set filtered cookies state to show the results
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
        <label htmlFor="price-filter">Price Range: </label>
        <select id="price-filter" value={priceRange} onChange={handlePriceRangeChange}>
          <option value="">All</option>
          <option value="Below $2">Below $2</option>
          <option value="$2 - $3">$2 - $3</option>
          <option value="Above $3">Above $3</option>
        </select>

        <label htmlFor="category-filter">Category: </label>
        <select id="category-filter" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <label htmlFor="stock-filter">Stock Status: </label>
        <select id="stock-filter" value={stockStatus} onChange={handleStockStatusChange}>
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
              key={cookie._id} // Make sure the key is unique (use _id if available)
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

      {/* Category Count Display */}
      <div className="category-count mt-8 p-6 bg-gray-800 rounded-lg shadow-lg text-white">
        <h3 className="text-2xl font-semibold mb-4">Cookies count per Category:</h3>
        {categoryCounts.map((category) => (
          <p key={category._id} className="text-lg">
            <span className="font-bold">{category._id}:</span> {category.count} cookie{category.count > 1 ? 's' : ''}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
