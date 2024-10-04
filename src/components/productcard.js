import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
      <h2 className="text-2xl mt-4 font-bold">{product.name}</h2>
      <p className="text-gray-700 mt-2">{product.description}</p>
      <p className="mt-4 text-lg font-bold">${product.price}</p>
      <button className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded">Buy Now</button>
    </div>
  );
};

export default ProductCard;
