import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './maps.css'; // Importing CSS for styles

const Branches = () => {
  // const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // return (
  //   <div className="branch-container">
  //     <iframe
  //       width="100%"
  //       height="100%"
  //       style={{ border: 0 }}
  //       loading="lazy"
  //       allowFullScreen
  //       referrerPolicy="no-referrer-when-downgrade"
  //       src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Mikve+Israel+St+26,Tel+Aviv-Yafo,Israel`}>
  //     </iframe>
  //   </div>
  // );
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBranchMap, setSelectedBranchMap] = useState(null);

  useEffect(() => {
      // Fetch branches from the API
      const fetchBranches = async () => {
          try {
              const response = await axios.get('/api/branches/list');
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
        <h2>Our Branches</h2>
        {branches.length > 0 ? (
            <ul>
                {branches.map((branch) => (
                    <li key={branch._id} style={{ margin: '20px 0' }}>
                        <h3>{branch.name}</h3>
                        <p>
                            <strong>Address:</strong> {branch.address.streetNumber} {branch.address.streetName}, {branch.address.city}, {branch.address.state}, {branch.address.country} - {branch.address.zipCode}
                        </p>
                        <p>
                            <strong>Contact:</strong> {branch.contact.phone} | {branch.contact.email}
                        </p>
                        <button onClick={() => handleViewOnMap(branch)}>View on Map</button>
                    </li>
                ))}
            </ul>
        ) : (
            <p>No branches available.</p>
        )}
        
        {/* Render the map HTML using dangerouslySetInnerHTML */}
        {selectedBranchMap && (
                <div
                    className="map-container"
                    style={{ marginTop: '20px', width: '100%', height: '400px' }}
                    dangerouslySetInnerHTML={{ __html: selectedBranchMap }}
                ></div>
            )}
    </div>
);

  // return (
  //   <ul role="list" className="divide-y divide-gray-100">
  //     {people.map((person) => (
  //       <li key={person.email} className="flex justify-between gap-x-6 py-5">
  //         <div className="flex min-w-0 gap-x-4">
  //           <img alt="" src={person.imageUrl} className="h-12 w-12 flex-none rounded-full bg-gray-50" />
  //           <div className="min-w-0 flex-auto">
  //             <p className="text-sm/6 font-semibold text-gray-900">{person.name}</p>
  //             <p className="mt-1 truncate text-xs/5 text-gray-500">{person.email}</p>
  //           </div>
  //         </div>
  //         <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
  //           <p className="text-sm/6 text-gray-900">{person.role}</p>
  //           {person.lastSeen ? (
  //             <p className="mt-1 text-xs/5 text-gray-500">
  //               Last seen <time dateTime={person.lastSeenDateTime}>{person.lastSeen}</time>
  //             </p>
  //           ) : (
  //             <div className="mt-1 flex items-center gap-x-1.5">
  //               <div className="flex-none rounded-full bg-emerald-500/20 p-1">
  //                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
  //               </div>
  //               <p className="text-xs/5 text-gray-500">Online</p>
  //             </div>
  //           )}
  //         </div>
  //       </li>
  //     ))}
  //   </ul>
  // );
};

export default Branches;
