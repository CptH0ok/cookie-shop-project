// models/Branch.js

const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        streetNumber: {
            type: String,
            required: true
        },
        streetName: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    contact: {
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    openingHours: {
        monday: { type: String, required: true },
        tuesday: { type: String, required: true },
        wednesday: { type: String, required: true },
        thursday: { type: String, required: true },
        friday: { type: String, required: true },
        saturday: { type: String, required: true },
        sunday: { type: String, required: true }
    },
    services: {
        delivery: { type: Boolean, default: false },
        takeaway: { type: Boolean, default: true },
        dineIn: { type: Boolean, default: true }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Branch = mongoose.model('Branch', branchSchema);

module.exports = Branch;
