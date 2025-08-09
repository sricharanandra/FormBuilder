const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Serve static files (uploaded images) with proper headers
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    next();
}, express.static(path.join(__dirname, 'uploads')));

// Better MongoDB connection handling
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/formbuilder');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log('MongoDB connection error:', error.message);
        console.log('Make sure MongoDB is running: sudo systemctl start mongodb');
        process.exit(1);
    }
};

connectDB();

// Routes
app.use('/api/forms', require('./routes/forms'));
app.use('/api/responses', require('./routes/responses'));
app.use('/api/images', require('./routes/images'));

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
