const express = require('express');
const Response = require('../models/Response');
const router = express.Router();

// Create a new response
router.post('/', async (req, res) => {
    try {
        console.log('Saving response:', req.body);
        const response = new Response(req.body);
        const savedResponse = await response.save();
        console.log('Response saved successfully:', savedResponse._id);
        res.status(201).json(savedResponse);
    } catch (error) {
        console.error('Error saving response:', error);
        res.status(400).json({ message: error.message });
    }
});

// Get responses for a specific form
router.get('/form/:formId', async (req, res) => {
    try {
        const responses = await Response.find({ formId: req.params.formId });
        res.json(responses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all responses with form counts
router.get('/stats', async (req, res) => {
    try {
        const totalResponses = await Response.countDocuments();
        const responsesByForm = await Response.aggregate([
            {
                $group: {
                    _id: '$formId',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            totalResponses,
            responsesByForm
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
