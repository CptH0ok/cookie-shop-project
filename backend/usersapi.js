const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/user');
const PurchaseHistory = require('./models/purchasehistory');
const {authenticateJWT, checkAdmin, checkPermissions} = require('./middlewares');

// 1. Create a new user
router.post('/create', authenticateJWT, checkAdmin, async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});

// 2. Update a user by ID
router.put('/update/:userId', authenticateJWT, checkPermissions, async (req, res) => {
    if (req.body.password){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
});

// 3. Delete a user by ID
router.delete('/delete/:userId', authenticateJWT, checkPermissions, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting user', error });
    }
});

// 4. List all users
router.get('/list', authenticateJWT, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching users', error });
    }
});

// 5. Enhanced Search users by name, city, opening hours, or services
router.get('/search', authenticateJWT, async (req, res) => {
    const { id, googleId, email, name, role } = req.query;
    const searchCriteria = {};

    if (id) searchCriteria._id = id;

    if (googleId) searchCriteria.googleId = googleId;

    // Filter by user name (case-insensitive, partial match)
    if (name) searchCriteria.name = new RegExp(name, 'i');
    
    // Filter by email (case-insensitive, partial match)
    if (email) searchCriteria['email'] = new RegExp(email, 'i');

    // Filter by role (admin/user)
    if (role) searchCriteria.role = role;

    try {
        const users = await User.find(searchCriteria);
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: 'Error searching users', error });
    }

    //example of filtering:
    // GET /api/users/search?name=ethan
    // GET /api/users/search?role=admin

});

// 6. get purchase history of specific user
router.get('/:userId/purchase-history', authenticateJWT, checkPermissions, async (req, res) => {
    try {
        const { userId } = req.params;
    
        const purchases = await PurchaseHistory.aggregate([
          { $match: { memberId: new mongoose.Types.ObjectId(userId) } },
          {
            $lookup: {
              from: 'cookie_shop',
              localField: 'items.cookieId',
              foreignField: 'id',
              as: 'itemDetails'
            }
          },
          {
            $project: {
              items: {
                $map: {
                  input: "$items",
                  as: "item",
                  in: {
                    quantity: "$$item.quantity",
                    cookie: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$itemDetails",
                            as: "cookie",
                            cond: { $eq: ["$$cookie.id", "$$item.cookieId"] }
                          }
                        },
                        0
                      ]
                    }
                  }
                }
              },
              purchaseDate: 1
            }
          }
        ]);
    
        res.json(purchases);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
});

// 7. Update purchase history endpoint
router.post('/:userId/purchase-history/create', authenticateJWT, checkPermissions, async (req, res) => {
  const userId = req.params.userId;
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items are required and should be an array' });
  }

  try {
    // Create a new purchase record
    const newPurchase = new PurchaseHistory({
      memberId: userId,
      items,
      purchaseDate: new Date(), // Set the current date
    });

    // Save the new purchase history to the database
    await newPurchase.save();

    res.status(201).json({ message: 'Purchase history created successfully', purchase: newPurchase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 8. get user info for navbar
router.get('/getuserdetails', authenticateJWT, async(req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      
      const { email, name, picture, sub } = req.user;
      const user = await User.findOne({email}); //get id from db
      const userDetails = { id:user.id, email, name };
      
      if (picture) {
        userDetails.picture = picture;
      }

      if (sub) {
        userDetails.googleId = sub;
      }
  
      res.json(userDetails);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve user details' });
    }
  });
  

module.exports = router;
