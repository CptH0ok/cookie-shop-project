// branchesapi.js

const express = require('express');
const Branch = require('./models/branch'); // Assuming Branch model is in models folder
const router = express.Router();

// 1. Create a new branch
router.post('/create', async (req, res) => {
    try {
        const newBranch = new Branch(req.body);
        const savedBranch = await newBranch.save();
        res.status(201).json(savedBranch);
    } catch (error) {
        res.status(400).json({ message: 'Error creating branch', error });
    }
});

// 2. Update a branch by ID
router.put('/update/:id', async (req, res) => {
    try {
        const updatedBranch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBranch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        res.json(updatedBranch);
    } catch (error) {
        res.status(400).json({ message: 'Error updating branch', error });
    }
});

// 3. Delete a branch by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedBranch = await Branch.findByIdAndDelete(req.params.id);
        if (!deletedBranch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        res.json({ message: 'Branch deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting branch', error });
    }
});

// 4. List all branches
router.get('/list', async (req, res) => {
    try {
        const branches = await Branch.find();
        res.json(branches);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching branches', error });
    }
});

// 5. Enhanced Search branches by name, city, opening hours, or services
router.get('/search', async (req, res) => {
    const { name, city, day, time, delivery, takeaway, dineIn } = req.query;
    const searchCriteria = {};

    // Filter by branch name (case-insensitive, partial match)
    if (name) searchCriteria.name = new RegExp(name, 'i');
    
    // Filter by city (case-insensitive, partial match)
    if (city) searchCriteria['address.city'] = new RegExp(city, 'i');

    // Filter by opening hours for a specific day and time
    if (day && time) {
        searchCriteria[`openingHours.${day.toLowerCase()}`] = {
            $regex: new RegExp(`(^|\\s)${time}(\\s|$)`, 'i') // Time can be matched within the string
        };
    }

    // Filter by services (if true, only branches offering the service will be returned)
    if (delivery !== undefined) searchCriteria['services.delivery'] = delivery === 'true';
    if (takeaway !== undefined) searchCriteria['services.takeaway'] = takeaway === 'true';
    if (dineIn !== undefined) searchCriteria['services.dineIn'] = dineIn === 'true';

    try {
        const branches = await Branch.find(searchCriteria);
        res.json(branches);
    } catch (error) {
        res.status(400).json({ message: 'Error searching branches', error });
    }
});

// 6. Function to get Google Maps iframe for a branch location
router.get('/map/:id', async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ message: 'Branch not found' });
        }

        const { streetNumber, streetName, city, state, country } = branch.address;
        const addressQuery = `${streetNumber}+${streetName},+${city},+${state},+${country}`;
        const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(addressQuery)}`;

        res.send(`
            <div class="map-container">
                <iframe
                    width="100%"
                    height="100%"
                    style="border:0"
                    loading="lazy"
                    allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade"
                    src="${mapUrl}">
                </iframe>
            </div>
        `);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching map iframe', error });
    }
});

module.exports = router;
