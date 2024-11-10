import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiration: '',
    cvv: ''
  });

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping] = useState(4.99);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [convertedSubtotal, setConvertedSubtotal] = useState(0);
  const [convertedShipping, setConvertedShipping] = useState(0);
  const [convertedTotal, setConvertedTotal] = useState(0);
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const api = axios.create({
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

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
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }

      const userResponse = await axios.get('http://localhost:3001/api/users/getuserdetails', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userId = userResponse.data.id;

      if (!userId) {
        throw new Error('No user ID found in response');
      }

      const cartResponse = await axios.get(`http://localhost:3001/api/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!cartResponse.data.cart || !cartResponse.data.cart.items) {
        return [];
      }

      const items = cartResponse.data.cart.items
        .filter(item => item && item.cookie)
        .map(item => {
          const cookieData = item.cookie;
          
          if (!cookieData) {
            return null;
          }

          return {
            id: cookieData._id,
            name: cookieData.name || 'Unknown Cookie',
            price: typeof cookieData.price === 'number' 
              ? cookieData.price 
              : Number(cookieData.price?.$numberDouble || cookieData.price),
            image: cookieData.imageUrl || '',
            description: cookieData.description || '',
            quantity: item.quantity || 1
          };
        })
        .filter(item => item !== null);

      setCartItems(items);
      calculateSubtotal(items);
      return items;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
  };

  const calculateSubtotal = (items) => {
    if (!items || !Array.isArray(items)) {
      setSubtotal(0);
      return;
    }

    const total = items.reduce((sum, item) => {
      if (!item || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        return sum;
      }
      return sum + (item.price * item.quantity);
    }, 0);

    setSubtotal(total);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    const updateConvertedPrices = async () => {
      if (subtotal > 0) {
        const convertedSubtotalAmount = await convertAmount(subtotal);
        const convertedShippingAmount = await convertAmount(shipping);
        setConvertedSubtotal(convertedSubtotalAmount);
        setConvertedShipping(convertedShippingAmount);
        setConvertedTotal(convertedSubtotalAmount + convertedShippingAmount + 2);
      }
    };

    updateConvertedPrices();
  }, [subtotal, shipping, selectedCurrency]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await axios.get('http://localhost:3001/api/users/getuserdetails', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userId = userResponse.data.id;
  
      // Get cart items with populated cookie data
      const cartResponse = await axios.get(`http://localhost:3001/api/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      // Transform cart items to match purchase history schema
      const purchaseItems = cartResponse.data.cart.items.map(item => ({
        itemName: item.cookie.name,
        quantity: item.quantity,
        price: item.cookie.price,
        imageUrl: item.cookie.imageUrl
      }));
  
      const purchaseData = {
        userId: userId,
        items: purchaseItems,
        totalAmount: selectedCurrency === 'USD' 
          ? (subtotal + shipping + 2) 
          : convertedTotal
      };
  
      // Save purchase history
      await axios.post(
        'http://localhost:3001/api/purchasehistory/create',
        purchaseData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      // Get current cart version
      const currentVersion = cartResponse.data.cart.version;
      console.log('Current cart version:', currentVersion); // Debug log
  
      // Remove each item from cart
      for (const item of cartResponse.data.cart.items) {
        try {
          console.log('Removing item:', item.cookie._id); // Debug log
          await axios.delete('http://localhost:3001/api/cart/remove', {
            headers: { 
              Authorization: `Bearer ${token}` 
            },
            data: {
              userId: userId,
              cookieId: item.cookie._id,
              version: currentVersion // Include the version
            }
          });
        } catch (removeError) {
          console.error('Error removing item:', removeError.response?.data);
          throw removeError; // Re-throw to trigger the outer catch block
        }
      }
  
      // Show success popup and navigate only if all operations succeeded
      alert('Enjoy your order! 🍪');
      navigate('/');
  
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Error processing your order. Please try again.');
    }
  };


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
    <div className="pt-5">
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0"></div>
    <div className="bg-white py-8 antialiased md:py-16">
      <form onSubmit={handleSubmit} className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <ol className="flex w-full max-w-2xl items-center text-center text-sm font-medium text-gray-500 sm:text-base">
        <li className="flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 sm:after:inline-block sm:after:content-['']">
            <Link to="/cart" className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] sm:after:hidden text-yellow-500">
                <svg
                className="me-2 h-4 w-4 sm:h-5 sm:w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                >
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                </svg>
                Cart
            </Link>
            </li>
          <li className="flex items-center text-primary-700 after:mx-6 after:hidden after:h-1 after:w-full after:border-b after:border-gray-200 sm:after:inline-block sm:after:content-['']">
            <span className="flex items-center after:mx-2 after:text-gray-200 after:content-['/'] sm:after:hidden">
              <svg
                className="me-2 h-4 w-4 sm:h-5 sm:w-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              Checkout
            </span>
          </li>

          <li className="shrink-0 flex items-center">
            <svg
              className="me-2 h-4 w-4 sm:h-5 sm:w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Order summary
          </li>
        </ol>

        <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">
          <div className="min-w-0 flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Delivery Details
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="your_name" className="mb-2 block text-sm font-medium text-gray-900">
                    Your name
                  </label>
                  <input
                    type="text"
                    id="your_name"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Bonnie Green"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="your_email" className="mb-2 block text-sm font-medium text-gray-900">
                    Your email*
                  </label>
                  <input
                    type="email"
                    id="your_email"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="name@flowbite.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="select-country-input-3" className="block text-sm font-medium text-gray-900">
                    Country*
                  </label>
                  <select
                    id="select-country-input-3"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option selected>United States</option>
                    <option value="AS">Australia</option>
                    <option value="FR">France</option>
                    <option value="ES">Israel</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="select-city-input-3" className="block text-sm font-medium text-gray-900">
                    City*
                  </label>
                  <select
                    id="select-city-input-3"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option selected>San Francisco</option>
                    <option value="NY">New York</option>
                    <option value="LA">Los Angeles</option>
                    <option value="CH">Chicago</option>
                    <option value="HU">Houston</option>
                  </select>
                </div>

                <div div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone-input-3" className="mb-2 block text-sm font-medium text-gray-900">
                    Phone Number*
                  </label>
                  <div className="flex items-center">
                    <button
                      id="dropdown-phone-button-3"
                      className="z-10 inline-flex shrink-0 items-center rounded-s-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100"
                      type="button"
                    >
                      +972
                    </button>
                    <div className="relative w-full">
                      <input
                        type="text"
                        id="phone-input"
                        className="z-20 block w-full rounded-e-lg border border-s-0 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        placeholder="123-456-7890"
                        required
                        onChange={handleInputChange}
                        value={formData.phone}
                      />
                    </div>
                  </div>
                </div>

                <div>
                    <label htmlFor="address-input" className="mb-2 block text-sm font-medium text-gray-900">
                      Address*
                    </label>
                    <input
                      type="text"
                      id="address-input"
                      name="address"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                      placeholder="123 Main St"
                      required
                      onChange={handleInputChange}
                      value={formData.address}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="voucher" className="mb-2 block text-sm font-medium text-gray-900">
                Enter a gift card, voucher or promotional code
              </label>
              <div className="flex max-w-md items-center gap-4">
                <input
                  type="text"
                  id="voucher"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                  placeholder=""
                />
                <button
                  type="button"
                  className="flex items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 w-full border border-gray-200 p-6 sm:p-8 lg:mt-0 lg:max-w-sm lg:flex-shrink-0 lg:rounded-lg">
          <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

          <ul className="mt-4 space-y-4">
              {cartItems.map((item, index) => (
                <li key={index} className="flex items-start justify-between">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg border border-gray-200"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {selectedCurrency === 'USD'
                        ? `$${shipping.toFixed(2)}`
                        : `${convertedShipping.toFixed(2)} ${selectedCurrency}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500">Currency</p>
                <CurrencySelector />
            </div>
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">
                {selectedCurrency === 'USD'
                    ? `$${subtotal.toFixed(2)}`
                    : `${convertedSubtotal.toFixed(2)} ${selectedCurrency}`}
                </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">Shipping</p>
                <p className="text-sm font-medium text-gray-900">
                {selectedCurrency === 'USD'
                    ? `$${shipping.toFixed(2)}`
                    : `${convertedShipping.toFixed(2)} ${selectedCurrency}`}
                </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">Tax</p>
                <p className="text-sm font-medium text-gray-900">$2.00</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <p className="text-base font-medium text-gray-900">Total</p>
                <p className="text-base font-medium text-gray-900">
                {selectedCurrency === 'USD'
                    ? `$${convertedTotal.toFixed(2)}`
                    : `${convertedTotal.toFixed(2)} ${selectedCurrency}`}
                </p>
            </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`bg-yellow-500 mt-6 w-full rounded-lg px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                >
                {isLoading ? 'Processing...' : 'Place Order'}
                </button>

                {error && (
                <p className="mt-2 text-red-600 text-sm">{error}</p>
                )}
          </div>
        </div>
      </form>
    </div>
</div>
  );
};

export default CheckoutPage;
