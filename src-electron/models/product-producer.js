const mongoose = require('mongoose')
const Product_producer_detail = require('./product-producer-detail')

const schema = new mongoose.Schema({
    barcode: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    measure: {
        type: String,
        required: true,
    },
    // buyPrice: {
    //     type: Number,
    //     required: true,
    // },
    // sellPrice: {
    //     type: Number,
    //     required: false,
    // },
    description: {
        type: String,
        required: false,
    },
    productDetailArr: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Product_producer_detail
    }]
})

module.exports = mongoose.model('product-producer', schema)
