import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const userResponse = await axios.get('http://localhost:3001/api/users/getuserdetails', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userId = userResponse.data.id;

        const response = await axios.get(`http://localhost:3001/api/purchasehistory/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setPurchases(response.data.purchases);
        setLoading(false);
      } catch (error) {
        console.error('Error details:', error);
        setError('Failed to load purchase history');
        setLoading(false);
      }
    };

    if (token) {
      fetchPurchases();
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Purchase History</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
              <p>{error}</p>
            </div>
          ) : purchases.length === 0 ? (
            <div className="text-center text-gray-500 p-8">
              <p className="text-xl">No purchase history found</p>
              <button 
                onClick={() => navigate('/shop')}
                className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {purchases.map((purchase) => (
                <div 
                  key={purchase._id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          Order Date: {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Order ID: {purchase._id}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-gray-900">
                        Total: ${purchase.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4">
                    <h3 className="text-lg font-semibold mb-4">Items</h3>
                    <div className="space-y-4">
                      {/* This is where the updated item display code goes */}
                      {purchase.items.map((item, index) => (
                        <div 
                          key={index}
                          className="flex items-center py-4 border-b border-gray-100 last:border-0"
                        >
                          {/* Image with logging */}
                          <div className="flex-shrink-0 h-20 w-20">
                            {console.log('Item data:', item)} {/* Add this to debug */}
                            <img
                              src={item.imageUrl || 'https://via.placeholder.com/80?text=Cookie'}
                              alt={item.itemName}
                              className="h-full w-full object-cover rounded-lg shadow-sm"
                              onError={(e) => {
                                console.log('Image failed to load:', item.imageUrl);
                                e.target.onerror = null; // Prevent infinite loop
                                e.target.src = 'https://via.placeholder.com/80?text=Cookie';
                              }}
                            />
                          </div>
                          
                          {/* Item Details */}
                          <div className="flex-1 ml-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{item.itemName}</h4>
                                <p className="text-sm text-gray-500">
                                  Quantity: {item.quantity}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Price per item: ${item.price.toFixed(2)}
                                </p>
                                {item.category && (
                                  <p className="text-sm text-gray-500">
                                    Category: {item.category}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-sm text-gray-600">
                        <p>Subtotal</p>
                        <p>${purchase.totalAmount.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between mt-2 text-base font-medium text-gray-900">
                        <p>Total</p>
                        <p>${purchase.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;