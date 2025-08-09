const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        default: 'Untitled Form'
    },
    description: {
        type: String,
        default: ''
    },
    headerImage: {
        type: String,
        default: ''
    },
    questions: [{
        id: String,
        type: {
            type: String,
            required: true,
            enum: ['categorize', 'cloze', 'comprehension']
        },
        title: String,
        image: {
            type: String,
            default: ''
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
    }],
    settings: {
        allowMultipleSubmissions: {
            type: Boolean,
            default: true
        },
        showProgressBar: {
            type: Boolean,
            default: true
        },
        randomizeQuestions: {
            type: Boolean,
            default: false
        }
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

FormSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Form', FormSchema);
