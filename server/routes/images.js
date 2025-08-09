const express = require('express');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Upload single image
router.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        // Return just the path, not the full URL
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete image
router.delete('/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join('uploads', filename);

        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            res.json({ message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
