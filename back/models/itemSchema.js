const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    userId: {
        type: String,
        required: true
    },
    reservedBy: {
        type: String,
        default: null
    },
    userEmail: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('item', itemSchema);