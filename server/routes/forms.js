const express = require('express');
const Form = require('../models/Form');
const router = express.Router();

// Get all forms
router.get('/', async (req, res) => {
    try {
        console.log('Getting all forms...');
        const forms = await Form.find().sort({ createdAt: -1 });
        console.log('Found forms:', forms.length);
        res.json(forms);
    } catch (error) {
        console.error('Error in GET /forms:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get single form
router.get('/:id', async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.json(form);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create form
router.post('/', async (req, res) => {
    try {
        const form = new Form(req.body);
        const savedForm = await form.save();
        res.status(201).json(savedForm);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update form
router.put('/:id', async (req, res) => {
    try {
        const form = await Form.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(form);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete form
router.delete('/:id', async (req, res) => {
    try {
        const form = await Form.findByIdAndDelete(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.json({ message: 'Form deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
