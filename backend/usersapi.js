// usersapi.js

const express = require('express');
const User = require('./models/user');
const PurchaseHistory = require('./models/purchasehistory');
const bcrypt = require('bcryptjs');
const router = express.Router();
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
router.put('/update/:id', authenticateJWT, checkPermissions, async (req, res) => {
    if (req.body.password){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
});

// 3. Delete a user by ID
router.delete('/delete/:id', authenticateJWT, checkPermissions, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
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
        const purchases = await PurchaseHistory.find({ memberId: req.params.userId });
        res.json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching purchase history', error });
    }
});

router.get('/getuserdetails', authenticateJWT, async(req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const { id, email, name, picture, sub, role } = req.user;
      const userDetails = { id, email, name, role};
      
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
