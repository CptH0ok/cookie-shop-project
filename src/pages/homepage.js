import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './homepage.css'; // Custom CSS for styles

const HomePage = () => {
  const [photoData, setPhotoData] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Function to fetch photo data from /api/getlastdataphoto
    const fetchPhotoData = async () => {
      try {
        const response = await axios.get('/api/getlastdataphoto');
        const data = response.data;
        setPhotoData(data); // Store photo data
      } catch (error) {
        console.error('Error fetching photo data:', error);
      }
    };

    // Function to fetch comments from /api/getlastdatacomments
    const fetchComments = async () => {
      try {
        const response = await axios.get('/api/getlastdatacomments');
        const data = response.data;
        setComments(data); // Store comments
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    // Initial fetch
    fetchPhotoData();
    fetchComments();

    // Re-fetch comments every hour (3600000 milliseconds)
    const interval = setInterval(() => {
      fetchComments();
    }, 3600000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    
    <div className="bg-gray-900 text-white h-screen flex flex-col justify-between">
      {/* Header Section */}
      <div className="flex items-center justify-center p-4">
        <h1 className="text-5xl font-bold">Welcome to Our Cookie Shop</h1>
      </div>
      <div className="relative">
        {/* Header for Facebook Activity */}
        <div className="bg-gray-700 text-white text-center py-1 flex items-center justify-center">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" // Facebook logo URL
            alt="Facebook Logo"
            className="w-6 h-6 mr-2" // Adjust size as needed
          />
          <h2 className="text-lg font-bold">Our Latest Facebook Activity</h2>
        </div>

        {/* Footer Section */}
        <footer className="bg-gray-800 text-white flex justify-start items-center relative" style={{ height: '96px' }}>
          {/* Display the description and image on the bottom-left corner */}
          {photoData && photoData.length > 0 && (
            <div className="flex items-center">
              {photoData[0].description && (
                <p className="mr-4 text-sm max-w-xs">{photoData[0].description}</p>
              )}
              {photoData[0].media && photoData[0].media.image && (
                <img
                  src={photoData[0].media.image.src}
                  alt="Footer Image"
                  className="w-20 h-20 rounded-lg" // Fixed size for the image
                />
              )}
            </div>
          )}

          {/* Moving Comments Section */}
          <div className="flex-1 text-center relative overflow-hidden">
            {comments.length > 0 ? (
              <div className="whitespace-nowrap overflow-hidden">
                <div className="marquee">
                  <div
                    className="inline-block"
                    style={{
                      animationDuration: `${comments.length * 3}s`, // Adjust speed as needed
                    }}
                  >
                    {comments.map((comment, index) => (
                      <span key={index} className="mr-8">
                        <strong>{comment.from.name}:</strong> {comment.message}
                      </span>
                    ))}
                  </div>
                  {/* Duplicate comments for continuous scrolling */}
                  <div className="inline-block">
                    {comments.map((comment, index) => (
                      <span key={`repeat-${index}`} className="mr-8">
                        <strong>{comment.from.name}:</strong> {comment.message}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p>No comments available.</p>
            )}
          </div>

          

        </footer>
      </div>
    </div>
  );
};

export default HomePage;