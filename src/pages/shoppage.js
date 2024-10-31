import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './shoppage.css';

const ShopPage = () => {
  const [cookies, setCookies] = useState([]);
  const [filteredCookies, setFilteredCookies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const navigate = useNavigate();

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
      <header className="header">
        <h1>Explore Our Delicious Cookies</h1>
        <p>From classic favorites to unique creations, find your perfect cookie in our wide variety.</p>
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
