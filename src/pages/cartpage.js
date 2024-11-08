import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping] = useState(4.99);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Configure axios with authentication
  const api = axios.create({
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const fetchCartItems = async () => {
    try {
      const response = await api.get(`/api/cart/${userId}`);
      // Transform the data to match your component's structure
      const transformedItems = response.data.cart.items.map(item => ({
        id: item.cookie.id,
        name: item.cookie.name,
        price: item.cookie.price,
        img: item.cookie.imageUrl,
        quantity: item.quantity
      }));
      return transformedItems;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
  };

  const updateQuantity = async (cookieId, delta) => {
    // Optimistically update UI
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cookieId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );

    try {
      await api.post('/api/cart/add', {
        userId,
        cookieId,
        quantity: delta
      });
      
      const updatedItems = await fetchCartItems();
      setCartItems(updatedItems);
      calculateSubtotal(updatedItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Refresh cart to revert to server state if error occurs
      const items = await fetchCartItems();
      setCartItems(items);
      calculateSubtotal(items);
    }
  };

  const removeItem = async (cookieId) => {
    // Optimistically update UI
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== cookieId));

    try {
      // You'll need to add this endpoint to your API
      await api.post('/api/cart/remove', {
        userId,
        cookieId
      });
      
      // Refresh cart to ensure consistency
      const updatedItems = await fetchCartItems();
      setCartItems(updatedItems);
      calculateSubtotal(updatedItems);
    } catch (error) {
      console.error('Error removing item:', error);
      // Refresh cart to revert to server state if error occurs
      const items = await fetchCartItems();
      setCartItems(items);
      calculateSubtotal(items);
    }
  };

  const calculateSubtotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(total);
  };

  useEffect(() => {
    const loadCart = async () => {
      const items = await fetchCartItems();
      setCartItems(items);
      calculateSubtotal(items);
    };

    if (userId && token) {
      loadCart();
    }
  }, [userId, token]);

  const total = subtotal + shipping;

  return (
    <div className="h-screen bg-gray-100 pt-20">
      <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
      <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
        <div className="rounded-lg md:w-2/3">
          {cartItems.map((item) => (
            <div key={item.id} className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
              <img
                src={item.img}
                alt="product-image"
                className="w-full rounded-lg sm:w-40"
              />
              <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                <div className="mt-5 sm:mt-0">
                  <h2 className="text-lg font-bold text-gray-900">{item.name}</h2>
                  <p className="mt-1 text-xs text-gray-700">{item.price.toFixed(2)} ₪</p>
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
                    <input
                      className="h-8 w-8 border bg-white text-center text-xs outline-none"
                      type="number"
                      value={item.quantity}
                      min="1"
                      readOnly
                    />
                    <span
                      className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      {" "}
                      +{" "}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-sm">{(item.price * item.quantity).toFixed(2)} ₪</p>
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
          ))}
        </div>

        {/* Subtotal */}
        <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
          <div className="mb-2 flex justify-between">
            <p className="text-gray-700">Subtotal</p>
            <p className="text-gray-700">{subtotal.toFixed(2)} ₪</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700">Shipping</p>
            <p className="text-gray-700">{shipping.toFixed(2)} ₪</p>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between">
            <p className="text-lg font-bold">Total</p>
            <div>
              <p className="mb-1 text-lg font-bold">{total.toFixed(2)} ₪</p>
              <p className="text-sm text-gray-700">including VAT</p>
            </div>
          </div>
          <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">
            Checkout
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