const checkPermissions = async (req, res, next) => {
    if (req.params.userId !== req.user?._id){
        checkAdmin(req, res, (err) => {
            if (err) return next(err);
        });
    }
  };
  
  const checkAdmin = async (req, res, next) => {
    const email = req.user.email
    let user = await User.findOne({ email }); //add user role from database
  
    if(req.user){
      req.user.role = user.role;
  
      if (req.user.role === 'admin') {
        next(); // The user is an admin, proceed to the next middleware or route
      } else {
        return res.status(403).send('Access denied. Admins only.');
      }
    } else {
      return res.status(500).send('Internal Error');
    }
  };
  
  // Middleware to authenticate JWT
  const authenticateJWT = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from headers
  
    if (!token) {
      return res.sendStatus(401); // Unauthorized if token is not provided
    }
  
    try {
      // Try verifying the JWT token with your secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next(); // Valid token, proceed to the next middleware
    } catch (err) {
      // If verification fails, it might be a Google token
      try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.REACT_APP_GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        });
        req.user = ticket.getPayload(); // Store user information in req.user
        return next(); // Valid Google token, proceed to the next middleware
      } catch (error) {
        console.error('Invalid token:', error);
        return res.sendStatus(403); // Forbidden if the token is invalid
      }
    }
  };

  module.exports = {authenticateJWT, checkAdmin, checkPermissions};