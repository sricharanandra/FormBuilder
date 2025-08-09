const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
    answers: [{
        questionId: String,
        answer: mongoose.Schema.Types.Mixed // Flexible answer storage
    }],
    submittedAt: { type: Date, default: Date.now },
    userInfo: {
        // Could add user details later if needed
        sessionId: String
    }
});

module.exports = mongoose.model('Response', responseSchema);
