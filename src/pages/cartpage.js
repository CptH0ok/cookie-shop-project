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

  // Create axios instance with auth header
  const api = axios.create({
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  // Currency conversion function
  const convertAmount = async (amount, fromCurrency = 'USD', toCurrency = selectedCurrency) => {
    if (toCurrency === 'USD') return amount; // No need to convert if target is USD
    
    try {
      const response = await axios.post('http://localhost:3001/api/currency/convert', {
        fromCurrency,
        toCurrency,
        amount
      });
      return parseFloat(response.data.message);
    } catch (error) {
      console.error('Error converting currency:', error);
      // Fallback conversion rates (temporary)
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
    console.log('Starting fetchCartItems');
    setError(null);
  
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      // Get user details
      const userResponse = await axios.get('http://localhost:3001/api/users/getuserdetails', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      console.log('User response data:', userResponse.data);
      const userId = userResponse.data.id;
      console.log("User ID:", userId);
  
      if (!userId) {
        throw new Error('No user ID found in response');
      }
  
      // Get cart items
      const cartResponse = await axios.get(`http://localhost:3001/api/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      console.log('Cart response:', cartResponse.data);
  
      if (!cartResponse.data.cart || !cartResponse.data.cart.items) {
        console.log("No cart or items found");
        return [];
      }
  
      const items = cartResponse.data.cart.items
        .filter(item => {
          console.log('Processing cart item:', item);
          return item && item.cookie;
        })
        .map(item => {
          console.log('Cookie data for item:', item.cookie);
          
          const cookieData = item.cookie;
          
          if (!cookieData) {
            console.log('Missing cookie data for item:', item);
            return null;
          }
  
          const mappedItem = {
            id: cookieData._id,
            name: cookieData.name || 'Unknown Cookie',
            price: typeof cookieData.price === 'number' 
              ? cookieData.price 
              : Number(cookieData.price?.$numberDouble || cookieData.price),
            img: cookieData.imageUrl || '',
            quantity: item.quantity || 1
          };
  
          console.log('Mapped item:', mappedItem);
          return mappedItem;
        })
        .filter(item => item !== null);
  
      console.log('Final transformed items:', items);
      return items || []; // Ensure we always return an array
  
    } catch (error) {
      console.error('Error in fetchCartItems:', error);
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      return []; // Return empty array on error
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
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const userId = userResponse.data.id;

    // Make the delete request
    await axios.delete('http://localhost:3001/api/cart/remove', {
      data: { // Important: for DELETE requests, we need to use 'data' property
        userId,
        cookieId
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    // Refresh cart after successful removal
    const items = await fetchCartItems();
    setCartItems(items);
    calculateSubtotal(items);
    
  } catch (error) {
    console.error('Error removing item:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    alert('Error removing item from cart');
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
      if (Array.isArray(items)) {
        setCartItems(items);
        calculateSubtotal(items);
      } else {
        console.error('fetchCartItems did not return an array:', items);
        setCartItems([]);
        calculateSubtotal([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading cart:', err);
      setCartItems([]);
      calculateSubtotal([]);
    } finally {
      setLoading(false);
    }
  };

  loadCart();
}, []);

  //const total = subtotal + shipping;

   // Add useEffect for currency conversion
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







// const OrderHistory = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedOrder, setExpandedOrder] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('/api/orders');
//       setOrders(response.data);
//     } catch (err) {
//       setError('Failed to load orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       processing: 'bg-blue-100 text-blue-800',
//       shipped: 'bg-purple-100 text-purple-800',
//       delivered: 'bg-green-100 text-green-800',
//       cancelled: 'bg-red-100 text-red-800'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (error) {
//     return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-2xl font-bold mb-6">Order History</h1>
      
//       {orders.length === 0 ? (
//         <div className="bg-white p-6 rounded-lg shadow text-center">
//           <p>You haven't placed any orders yet.</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {orders.map((order) => (
//             <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div 
//                 className="p-4 cursor-pointer hover:bg-gray-50"
//                 onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
//               >
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
//                   <div className="flex flex-col">
//                     <span className="font-semibold">Order #{order.orderNumber}</span>
//                     <span className="text-sm text-gray-500">
//                       {formatDate(order.createdAt)}
//                     </span>
//                   </div>
//                   <div className="flex items-center space-x-4 mt-2 sm:mt-0">
//                     <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
//                       {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                     </span>
//                     <span className="font-semibold">${order.total.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>

//               {expandedOrder === order._id && (
//                 <div className="p-4 border-t">
//                   <div className="space-y-4">
//                     {order.items.map((item, index) => (
//                       <div key={index} className="flex items-center space-x-4 border-b pb-4">
//                         <img 
//                           src={item.image} 
//                           alt={item.name} 
//                           className="w-20 h-20 object-cover rounded"
//                         />
//                         <div className="flex-1">
//                           <h3 className="font-medium">{item.name}</h3>
//                           <p className="text-sm text-gray-500">Size: {item.size}</p>
//                           <div className="flex justify-between items-center mt-2">
//                             <span className="text-sm">Qty: {item.quantity}</span>
//                             <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
//                           </div>
//                         </div>
//                       </div>
//                     ))}

//                     <div className="mt-6 border-t pt-4">
//                       <h4 className="font-medium mb-2">Shipping Address</h4>
//                       <p className="text-sm text-gray-600">
//                         {order.shippingAddress.street}<br />
//                         {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
//                         {order.shippingAddress.country}
//                       </p>
//                     </div>

//                     <div className="flex justify-between items-center pt-4">
//                       <button className="text-sm text-blue-600 hover:underline">
//                         Need help? Contact Support
//                       </button>
//                       {order.status === 'delivered' && (
//                         <button className="text-blue-600 hover:underline">
//                           Buy Again
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderHistory;