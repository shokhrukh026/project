const mongoose = require('mongoose')
// const Product_customer_detail = require('./product-customer-detail')


const schema = new mongoose.Schema({
    barcode: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    product_id: {
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
    buyPrice: {
        type: String,
        required: true,
    },
    payed: {
        type: String,
        required: true,
    },
    unPayed: {
        type: String,
        required: true,
    },
    // sellPrice: {
    //     type: Number,
    //     required: false,
    // },
    about: {
        type: String,
        required: false,
    },
    // productDetailArr: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: Product_customer_detail
    // }]
})

module.exports = mongoose.model('products-customer', schema)
