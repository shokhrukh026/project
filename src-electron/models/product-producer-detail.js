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
    amountLeft: {
        type: Number,
        required: true,
    },
    buyPrice: {
        type: String,
        required: true,
    },
    // sellPrice: {
    //     type: String,
    //     required: false,
    // },
    payed: {
        type: String,
        required: false,
    },
    unPayed: {
        type: String,
        required: false,
    },
    about: {
        type: String,
        required: false,
    }
})

module.exports = mongoose.model('product-producer-detail', schema)
