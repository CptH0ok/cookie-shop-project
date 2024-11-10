import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './reviews.css'; // Custom CSS for styles

const Reviews = () => {
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [photoCaptionData, setCaptionPhotoData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch reviews from the API
  const fetchReviews = async () => {
    const response = await axios.get('http://localhost:3001/api/facebook/pagereviews')
    .then((response) => {;
        setReviews(response.data);
    })
    .catch((err) => {
      // Handle error
      if (err.response) {
        // Server responded with a status other than 2xx
        setError('test');
      } else if (err.request) {
        // Request was made but no response received
        setError('No response from server');
      } else {
        // Something happened in setting up the request
        setError('Error setting up request');
      }
    });
  };

  // Fetch reviews on component mount and every 60 minutes (3600000 ms)
  useEffect(() => {

    const fetchPhotoCaptionData = async () => {
      const response = await axios.get('http://localhost:3001/api/facebook/getlastdatacaption')
        .then((response) => {
          const data = response.data;
          console.log(data);
          setCaptionPhotoData(data); // Store photo data;
        })
        .catch((err) => {
          // Handle error
          if (err.response) {
            // Server responded with a status other than 2xx
            setError('test');
          } else if (err.request) {
            // Request was made but no response received
            setError('No response from server');
          } else {
            // Something happened in setting up the request
            setError('Error setting up request');
          }
        });
    };

    const fetchPhotoData = async () => {
      const response = await axios.get('http://localhost:3001/api/facebook/getlastdataphoto')
        .then((response) => {
          const data = response.data;
          console.log(data);
          setPhotoData(data); // Store photo data;
        })
        .catch((err) => {
          // Handle error
          if (err.response) {
            // Server responded with a status other than 2xx
            setError('test');
          } else if (err.request) {
            // Request was made but no response received
            setError('No response from server');
          } else {
            // Something happened in setting up the request
            setError('Error setting up request');
          }
        });
    };

    // Function to fetch comments from /api/getlastdatacomments
    const fetchComments = async () => {

      const response = await axios.get('http://localhost:3001/api/facebook/getlastdatacomments')
      .then((response) => {;
        console.log(response);
        const data = response.data;
        setComments(data); // Store comments
      })
      .catch((err) => {
        // Handle error
        if (err.response) {
          // Server responded with a status other than 2xx
          setError('test');
        } else if (err.request) {
          // Request was made but no response received
          setError('No response from server');
        } else {
          // Something happened in setting up the request
          setError('Error setting up request');
        }
      });
    };

    // Initial fetch
    fetchPhotoCaptionData();
    fetchPhotoData();
    fetchComments();
    fetchReviews();
    const interval = setInterval(fetchReviews, 3600000); // Fetch every 60 minutes
    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  // Automatically switch reviews every 3 seconds unless paused
  useEffect(() => {
    if (!isPaused && reviews.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [reviews.length, isPaused]);

  // Format the date to display just the day
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if(error){
    return (
      <div class="error-container">
        <div class="error-message">
          <span class="caution">⚠️</span>
            Something went wrong! Please try again.
          <span class="caution">⚠️</span>
        </div>
        <details>
          <summary>More Info</summary>
          <p>Details: {error}</p>
        </details>
      </div>
    );
  }

  return (
    <div className="reviews-page">
    <div className="review-container rounded-3xl">
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div
            key={index}
            className={`review ${index === activeIndex ? 'active' : ''}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <p className={`recommendation ${review.recommendation_type}`}>
              {review.recommendation_type === 'positive' ? '👍' : '👎'}
            </p>
            <p className="review-text">{review.review_text}</p>
            <p className="review-date">Reviewed on: {formatDate(review.created_time)}</p>
          </div>
        ))
      ) : (
        <p>Loading reviews...</p>
      )}
    </div>

    <div className="relative">
  {/* Header for Facebook Activity */}
  <div className="bg-gray-700 text-white text-center py-1 flex items-center justify-center">
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
      alt="Facebook Logo"
      className="w-6 h-6 mr-2"
    />
    <h2 className="text-lg font-bold">Our Latest Facebook Activity</h2>
  </div>

  {/* Footer Section */}
  <footer className="bg-gray-800 text-white flex justify-start items-center p-4 relative">
    {/* Display the post image and description */}
    {photoData && photoData.length > 0 && (
      <div className="flex items-center">
        {photoData[0].media && photoData[0].media.image && (
          <img
            src={photoData[0].media.image.src}
            alt="Post Image"
            className="w-20 h-20 rounded-lg mr-4"
          />
        )}
        {photoCaptionData ? (
          <p className="text-sm max-w-xs">{photoCaptionData}</p>
        ) : (
          <p className="text-sm max-w-xs text-gray-400">No description available.</p>
        )}
      </div>
    )}

    {/* Display the first two comments */}
    <div className="ml-4">
      {comments.slice(0, 2).map((comment, index) => (
        <p key={index} className="text-sm">
          <strong>{comment.from.name}:</strong> {comment.message}
        </p>
      ))}
    </div>
  </footer>
</div>


    </div>
  );
};

export default Reviews;
