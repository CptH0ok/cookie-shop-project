import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping] = useState(4.99);
  const token = localStorage.getItem('token');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [convertedSubtotal, setConvertedSubtotal] = useState(0);
  const [convertedShipping, setConvertedShipping] = useState(0);
  const [convertedTotal, setConvertedTotal] = useState(0);


  const api = axios.create({
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  // Currency conversion function
  const convertAmount = async (amount, fromCurrency = 'USD', toCurrency = selectedCurrency) => {
    if (toCurrency === 'USD') return amount; 
    
    try {
      const response = await axios.post('http://localhost:3001/api/currency/convert', {
        fromCurrency,
        toCurrency,
        amount
      });
      return parseFloat(response.data.message);
    } catch (error) {
      console.error('Error converting currency:', error);
      const fallbackRates = {
        USD: 1,
        EUR: 0.93,
        GBP: 0.79,
        ILS: 3.70
      };
      return amount * fallbackRates[toCurrency];
    }
  };

  const fetchCartItems = async () => {
    setError(null);
  
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      // Fetch user details
      const userResponse = await axios.get('http://localhost:3001/api/users/getuserdetails', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const userId = userResponse.data.id;
      console.log('User ID:', userId);
  
      // Fetch cart items
      const cartResponse = await axios.get(`http://localhost:3001/api/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const cart = cartResponse.data.cart;
      console.log('Cart response:', cart);
  
      if (!cart || !cart.items || cart.items.length === 0) {
        console.log('No cart items found in response');
        return [];
      }
  
      const items = cart.items
        .filter((item) => item && item.cookie)
        .map((item) => {
          const cookieData = item.cookie;
          if (!cookieData) {
            console.log('Missing cookie data for item:', item);
            return null;
          }
  
          return {
            id: cookieData._id,
            name: cookieData.name || 'Unknown Cookie',
            price: typeof cookieData.price === 'number' ? cookieData.price : Number(cookieData.price?.$numberDouble || cookieData.price),
            img: cookieData.imageUrl || '',
            quantity: item.quantity || 1,
            version: item.version,
          };
        })
        .filter((item) => item !== null);
  
      console.log('Final transformed items:', items);
      return items;
    } catch (error) {
      console.error('Error in fetchCartItems:', error);
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data,
        });
      }
      return [];
    }
  };

  const updateQuantity = async (cookieId, delta) => {
    try {
      console.log('Updating quantity:', { cookieId, delta });
      
      const userResponse = await axios.get('http://localhost:3001/api/users/getuserdetails', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userId = userResponse.data.id;
  
      // Don't allow negative quantities
      const currentItem = cartItems.find(item => item.id === cookieId);
      if (currentItem && currentItem.quantity + delta <= 0) {
        // If quantity would become 0 or negative, remove the item
        await removeItem(cookieId);
        return;
      }
  
      // Update quantity
      const response = await axios.post('http://localhost:3001/api/cart/add', {
        userId,
        cookieId,
        quantity: delta
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
  
      // Refresh cart items
      const items = await fetchCartItems();
      setCartItems(items);
      calculateSubtotal(items);
    } catch (error) {
      console.error('Error updating quantity:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      alert('Error updating quantity');
    }
  };

  const removeItem = async (cookieId) => {
    try {
      console.log('Removing item with ID:', cookieId);
  
      const userResponse = await axios.get('http://localhost:3001/api/users/getuserdetails', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const userId = userResponse.data.id;
  
      // Get the version from the cartItems array, or use a default value if not found
      const item = cartItems.find((item) => item.id === cookieId);
      const version = item?.version || 0;
  
      // Make the delete request
      await axios.delete('http://localhost:3001/api/cart/remove', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId,
          cookieId,
          version,
        },
      });
  
      // Refresh cart after successful removal
      const items = await fetchCartItems();
      setCartItems(items);
      calculateSubtotal(items);
    } catch (error) {
      if (error.response?.data?.error === 'Version conflict, please refresh and try again') {
        alert('Version conflict, please refresh the page and try again.');
      } else {
        console.error('Error removing item:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
        alert('Error removing item from cart');
      }
    }
  };

const calculateSubtotal = (items) => {
  if (!items || !Array.isArray(items)) {
    console.log('No items to calculate subtotal');
    setSubtotal(0);
    return;
  }

  console.log('Calculating subtotal for items:', items);
  const total = items.reduce((sum, item) => {
    if (!item || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
      console.log('Invalid item:', item);
      return sum;
    }
    return sum + (item.price * item.quantity);
  }, 0);

  console.log('Calculated subtotal:', total);
  setSubtotal(total);
};

useEffect(() => {
  const loadCart = async () => {
    try {
      setLoading(true);
      const items = await fetchCartItems();
      setCartItems(items);
      calculateSubtotal(items);
    } catch (err) {
      setError(err.message);
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  loadCart();
}, []);


   useEffect(() => {
    const updateConvertedPrices = async () => {
      if (subtotal > 0) {
        const convertedSubtotalAmount = await convertAmount(subtotal);
        const convertedShippingAmount = await convertAmount(shipping);
        setConvertedSubtotal(convertedSubtotalAmount);
        setConvertedShipping(convertedShippingAmount);
        setConvertedTotal(convertedSubtotalAmount + convertedShippingAmount);
      }
    };

    updateConvertedPrices();
  }, [subtotal, shipping, selectedCurrency]);

  // Currency selector component
  const CurrencySelector = () => (
    <select
      value={selectedCurrency}
      onChange={(e) => setSelectedCurrency(e.target.value)}
      className="ml-2 border rounded-md p-1"
    >
      <option value="USD">USD ($)</option>
      <option value="EUR">EUR (€)</option>
      <option value="GBP">GBP (£)</option>
      <option value="ILS">ILS (₪)</option>
    </select>
  );

  return (
    <div className="h-screen bg-gray-100 pt-20">
      <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
      <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
        <div className="rounded-lg md:w-2/3">
          {loading ? (
            <p className="text-center text-gray-500">Loading cart...</p>
          ) : error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                <img
                  src={item.img}
                  alt="product-image"
                  className="w-full rounded-lg sm:w-40"
                />
                <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                  <div className="mt-5 sm:mt-0">
                    <h2 className="text-lg font-bold text-gray-900">{item.name}</h2>
                    <p className="mt-1 text-xs text-gray-700">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                    <div className="flex items-center border-gray-100">
                      <span
                        className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        {" "}
                        -{" "}
                      </span>
                      <div className="h-8 w-8 border bg-white flex items-center justify-center text-xs">
                        {item.quantity}
                      </div>
                      <span
                        className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        {" "}
                        +{" "}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-sm">{(item.price * item.quantity).toFixed(2)} $</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                        onClick={() => removeItem(item.id)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
        <div className="mb-2 flex justify-between items-center">
          <p className="text-gray-700">Currency</p>
          <CurrencySelector />
        </div>
        <div className="mb-2 flex justify-between">
          <p className="text-gray-700">Subtotal</p>
          <div>
            <p className="text-gray-700">${subtotal.toFixed(2)}</p>
            {selectedCurrency !== 'USD' && (
              <p className="text-sm text-gray-500">
                ≈ {convertedSubtotal.toFixed(2)} {selectedCurrency}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-700">Shipping</p>
          <div>
            <p className="text-gray-700">${shipping.toFixed(2)}</p>
            {selectedCurrency !== 'USD' && (
              <p className="text-sm text-gray-500">
                ≈ {convertedShipping.toFixed(2)} {selectedCurrency}
              </p>
            )}
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between">
          <p className="text-lg font-bold">Total</p>
          <div>
            <p className="mb-1 text-lg font-bold">${(subtotal + shipping).toFixed(2)}</p>
            {selectedCurrency !== 'USD' && (
              <p className="text-sm text-gray-700">
                ≈ {convertedTotal.toFixed(2)} {selectedCurrency}
              </p>
            )}
            <p className="text-sm text-gray-700">including VAT</p>
          </div>
        </div>
        <button className="mt-6 w-full rounded-md bg-yellow-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">
      <Link to="/checkout" className="block">
        Checkout
      </Link>
    </button>
      </div>
      </div>
    </div>
  );
};

export default CartPage;
