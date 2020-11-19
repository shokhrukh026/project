const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        // default: Date.now
    },
    amount: {
        type: Number,
        required: true,
    },
    buyPrice: {
        type: Number,
        required: true,
    },
    sellPrice: {
        type: Number,
        required: false,
    },
    about: {
        type: String,
        required: false,
    }
})

module.exports = mongoose.model('product-customer-detail', schema)
