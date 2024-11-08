// CookieDetailPage.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const CookieDetailPage = () => {
    const { name } = useParams();
    const decodedName = decodeURIComponent(name);
    const [cookie, setCookie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchCookie = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/cookies/search?name=${decodedName}`);
                const data = await response.json();
                if (data.length > 0) {
                    setCookie(data[0]);
                }
            } catch (error) {
                console.error('Error fetching cookie:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCookie();
    }, [decodedName]);


    //   const handleAddToCart = async () => {
    //     try {
    //       // Fetch user details
    //       const userResponse = await axios.get('http://localhost:3001/api/users/getuserdetails', {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         }
    //       });
      
    //       console.log("Token being sent:", localStorage.getItem('token'));
      
    //       if (!userResponse.data) {
    //         console.error('User not authenticated');
    //         alert('You must be logged in to add items to the cart');
    //         return;
    //       }
      
    //       const user = userResponse.data;
      
    //       // Validate that `cookie` object is available
    //       if (!cookie || !cookie.id) {
    //         console.error('Invalid cookie data');
    //         alert('Error: Invalid item data');
    //         return;
    //       }
      
    //       // First, check if the item already exists in the cart
    //       const cartResponse = await axios.get(`http://localhost:3001/api/cart/user/${user.id}`, {
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem('token')}`,
    //         }
    //       });

    //       // Add the item to the cart for the authenticated user
    //       const response = await axios.post('http://localhost:3001/api/cart/add', {
    //         userId: user.id,
    //         cookieId: cookie.id,
    //         quantity: quantity,
    //       }, {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           Authorization: `Bearer ${localStorage.getItem('token')}`,
    //         }
    //       });
      
    //       if (response.status === 200) {
    //         console.log(`Added ${quantity} ${cookie.name}(s) to the cart`);
    //         alert(`Added ${quantity} ${cookie.name}(s) to the cart`);
    //       } else {
    //         console.error('Failed to add item to cart');
    //         alert('Failed to add item to the cart');
    //       }
    //     } catch (error) {
    //       console.error('Error adding to cart:', error);
    //       alert('Error adding to cart, please try again');
    //     }
    //   };


    const handleAddToCart = async () => {
        try {
          // Fetch user details
          const userResponse = await axios.get('http://localhost:3001/api/users/getuserdetails', {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
      
          console.log("Token being sent:", localStorage.getItem('token'));
      
          if (!userResponse.data) {
            console.error('User not authenticated');
            alert('You must be logged in to add items to the cart');
            return;
          }
      
          const user = userResponse.data;
      
          // Validate that `cookie` object is available
          if (!cookie || !cookie.id) {
            console.error('Invalid cookie data');
            alert('Error: Invalid item data');
            return;
          }
      
          // Get the user's cart items
          const { data } = await axios.get(`http://localhost:3001/api/cart/${user.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
          });
      
          console.log("Cart data received:", data);
      
          // Add to cart (the backend will handle whether to update quantity or add new item)
          const response = await axios.post('http://localhost:3001/api/cart/add', {
            userId: user.id,
            cookieId: cookie.id,
            quantity: quantity,
          }, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
          });
      
          if (response.status === 200) {
            console.log(`Added ${quantity} ${cookie.name}(s) to the cart`);
            alert(`Added ${quantity} ${cookie.name}(s) to the cart`);
          } else {
            console.error('Failed to add item to cart');
            alert('Failed to add item to the cart');
          }
      
        } catch (error) {
          console.error('Error managing cart:', error.response?.data || error.message);
          alert(`Error managing cart: ${error.response?.data?.error || error.message}`);
        }
      };
      
      
    if (loading) return <div className="text-white">Loading...</div>;
    if (!cookie) return <div className="text-white">Cookie not found!</div>;

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4">
            <div className="pt-6">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb">
                    <ol className="flex max-w-2xl mx-auto items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                        <li>
                            <Link to="/shop" className="text-sm font-medium text-gray-400 hover:text-gray-500">
                                Cookies
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
                        <li className="text-sm font-medium text-gray-500">{cookie.name}</li>
                    </ol>
                </nav>

                {/* Cookie Details */}
                <div className="mt-6 max-w-2xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:gap-8">
                        {/* Image */}
                        <img
                            src={cookie.imageUrl}
                            alt={cookie.name}
                            className="lg:w-1/2 w-full h-auto object-contain rounded-lg"
                        />

                        {/* Details */}
                        <div className="mt-6 lg:mt-0 lg:flex-1">
                            <h1 className="text-3xl font-bold">{cookie.name}</h1>
                            <p className="mt-4 text-2xl text-green-500">${cookie.price}</p>

                            {/* Ingredients */}
                            <h2 className="mt-6 text-lg font-medium">Ingredients:</h2>
                            <p className="text-gray-300">{cookie.ingredients.join(', ')}</p>

                            {/* Description */}
                            <h2 className="mt-6 text-lg font-medium">Description:</h2>
                            <p className="text-gray-300">{cookie.description}</p>

                            {/* Quantity Selector */}
                            <div className="mt-6">
                                <label htmlFor="quantity" className="block text-sm font-medium">Select Quantity:</label>
                                <select
                                    id="quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="mt-1 block w-full max-w-xs rounded-md border-gray-700 bg-gray-800 focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="mt-6 w-full max-w-xs flex items-center justify-center mx-auto lg:mx-0 rounded-md bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700"
                            >
                                Add to Cart
                            </button>

                            {/* Back to Shop Button */}
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="mt-4 w-full max-w-xs flex items-center justify-center mx-auto lg:mx-0 rounded-md border border-gray-700 bg-gray-800 px-8 py-3 text-base font-medium text-white hover:bg-gray-700"
                            >
                                Back to Shop
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieDetailPage;
