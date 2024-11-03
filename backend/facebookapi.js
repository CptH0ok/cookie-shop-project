const axios = require('axios');

const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
const pageId = process.env.FACEBOOK_PAGE_ID;
const baseUrl = `https://graph.facebook.com/v21.0`;

/**
 * Function to read all reviews of a Facebook Page
 */
async function getFacebookPageReviews() {
  try {
    const response = await axios.get(
      `${baseUrl}/${pageId}/ratings`,
      {
        params: {
          access_token: accessToken,
          limit: 100,  // You can set a limit or paginate to retrieve all reviews
          fields: 'reviewer,review_text,recommendation_type,created_time'
        }
      }
    );
    console.log('Page Reviews:', response.data.data);
    response.data.data.forEach(review => {
        console.log(review.review_text);
    });
    return response.data.data
  } catch (error) {
    console.error('Error retrieving Facebook page reviews:', error.response?.data);
    throw error;
  }
}

/**
 * Function to post a message on the Facebook page
 * @param {string} message - The message you want to post
 */
async function postToFacebookPage(message) {
    try {
      const response = await axios.post(
        `${baseUrl}/${pageId}/feed`,
        {
          message: message
        },
        {
          params: {
            access_token: accessToken
          }
        }
      );
      console.log('Post ID:', response.data.id);
      return response.data.id;
    } catch (error) {
      console.error('Error posting to Facebook page:', error.response.data);
      throw error;
    }
  }

/**
 * Function to get the last post from the Facebook Page
 */
async function getLastFacebookPost() {
  try {
    const response = await axios.get(
      `${baseUrl}/${pageId}/posts`,
      {
        params: {
          access_token: accessToken,
          limit: 1,  // Get the latest post
          fields: 'id,message,created_time'
        }
      }
    );
    const lastPost = response.data.data[0];
    console.log('Last Post:', lastPost);
    return lastPost.id;

  } catch (error) {
    console.error('Error retrieving last Facebook page post:', error.response?.data);
    throw error;
  }
}

/**
 * Function to get comments on a Facebook post
 * @param {string} postId - The ID of the post
 */
async function getFacebookPostComments(postId) {
  try {
    const response = await axios.get(
      `${baseUrl}/${postId}/comments`,
      {
        params: {
          access_token: accessToken,
          fields: 'from{name},message'
        }
      }
    );
    console.log('Post Comments:', response.data.data);
    return response.data.data

  } catch (error) {
    console.error('Error retrieving post comments:', error.response?.data);
    throw error;
  }
}

/**
 * Function to get comments on a Facebook post
 * @param {string} postId - The ID of the post
 */
async function getFacebookPostPicture(postId) {
  try {
    const response = await axios.get(
      `${baseUrl}/${postId}/attachments`,
      {
        params: {
          access_token: accessToken,
          fields: 'description,media'
        }
      }
    );

    console.log('Picture Link:', response.data.data);
    return response.data.data;

  } catch (error) {
    console.error('Error retrieving picture link:', error.response?.data);
    throw error;
  }
}

/**
 * Function to get likes on a Facebook post
 * @param {string} postId - The ID of the post
 */
async function getFacebookPostLikes(postId) {
  try {
    const response = await axios.get(
      `${baseUrl}/${postId}/likes`,
      {
        params: {
          access_token: accessToken,
          fields: 'name'
        }
      }
    );
    console.log('Post Likes:', response.data.data);

    return response.data.data;
  } catch (error) {
    console.error('Error retrieving post likes:', error.response?.data);
    throw error;
  }
}

module.exports.getPostLikes = getFacebookPostLikes;
module.exports.getPostComments = getFacebookPostComments;
module.exports.getLastPost = getLastFacebookPost;
module.exports.postToPage = postToFacebookPage;
module.exports.getPageReviews = getFacebookPageReviews;
module.exports.getPostPicture = getFacebookPostPicture;