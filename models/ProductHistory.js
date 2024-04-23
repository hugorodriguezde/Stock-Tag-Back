const mongoose = require('mongoose');

const ProductHistorySchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        enum: ['created', 'removed'],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ProductHistory', ProductHistorySchema);