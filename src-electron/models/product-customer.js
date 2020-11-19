const mongoose = require('mongoose')
const Product_customer_detail = require('./product-customer-detail')


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
    // measure: {
    //     type: String,
    //     required: true,
    // },
    
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
        ref: Product_customer_detail
    }]
})

module.exports = mongoose.model('products-customer', schema)
