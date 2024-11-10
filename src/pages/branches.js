import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './maps.css'; // Importing CSS for styles
import shop1 from '../assets/shop1.jpg';
import shop2 from '../assets/shop2.webp';
import shop3 from '../assets/shop3.webp';
import shop4 from '../assets/shop4.jpg';
import shop5 from '../assets/shop5.jpg';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBranchMap, setSelectedBranchMap] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  const images = [shop1, shop2, shop3, shop4, shop5];

  useEffect(() => {
    // Fetch branches from the API
    const fetchBranches = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/branches/list');
        setBranches(response.data);
      } catch (err) {
        setError('Failed to load branches');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleViewOnMap = async (branch) => {
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:3001/api/branches/map/' + branch._id);
      setSelectedBranchMap(response.data.mapIframeHtml);
    } catch (err) {
      setError('Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  const getTimeOpened = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffMonths / 12);

    if (diffMonths < 6) {
      return `(${diffDays} days ago) NEW 🎉🆕 `;
    } else if (diffYears > 0) {
      return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    } else if (diffMonths > 0) {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="branches-page">
      <div></div>
      <ul role="list" className="divide-y divide-gray-100">
        {branches.map((branch, index) => {
          // Cycle through images without changing the state
          const imageSrc = images[(index + imageIndex) % images.length];

          return (
            <li key={branch._id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <img alt="" src={imageSrc} className="h-12 w-12 flex-none rounded-full bg-gray-50" />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold text-gray-900">{branch.name}</p>
                  <p className="mt-1 truncate text-xs text-gray-500">
                    {branch.address.streetNumber} {branch.address.streetName}, {branch.address.city}, {branch.address.state}, {branch.address.country} - {branch.address.zipCode}
                  </p>
                  <button
                    onClick={() => handleViewOnMap(branch)}
                    className="mt-2 text-xs text-blue-500 hover:underline"
                  >
                    View on Map
                  </button>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="text-sm text-gray-900">{branch.services.delivery ? "Delivery" : ""}</p>
                <p className="text-sm text-gray-900">{branch.services.takeaway ? "Takeaway" : ""}</p>
                <p className="text-sm text-gray-900">{branch.services.dineIn ? "DineIn" : ""}</p>
                {branch.createdAt ? (
                  <p className="mt-1 text-xs text-gray-500">
                    Opened {getTimeOpened(branch.createdAt)}
                  </p>
                ) : (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {selectedBranchMap && (
        <div
          className="map-container"
          style={{ marginTop: '20px', width: '100%', height: '200px' }}
          dangerouslySetInnerHTML={{ __html: selectedBranchMap }}
        ></div>
      )}
    </div>
  );
};

export default Branches;
