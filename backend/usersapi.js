// usersapi.js

const express = require('express');
const User = require('./models/user');
const router = express.Router();
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// 1. Create a new user
router.post('/create', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});

// 2. Update a user by ID
router.put('/update/:id', async (req, res) => {
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
router.delete('/delete/:id', async (req, res) => {
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
router.get('/list', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching users', error });
    }
});

// 5. Enhanced Search users by name, city, opening hours, or services
router.get('/search', async (req, res) => {
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
    // GET /api/users/search?city=New%20York
    // GET /api/users/search?delivery=true

});

module.exports = router;
