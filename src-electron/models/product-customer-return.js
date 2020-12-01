const mongoose = require('mongoose')
// const Product_customer_detail = require('./product-customer-detail')


const schema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    returnDate: {
        type: String,
        required: true,
    },
    cid:{
        type: String,
        required: true,
    },
    ppid:{
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
    returnReason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: false,
    }
    // payed: {
    //     type: String,
    //     required: true,
    // },
    // unPayed: {
    //     type: String,
    //     required: true,
    // },
    // sellPrice: {
    //     type: Number,
    //     required: false,
    // },
    // about: {
    //     type: String,
    //     required: false,
    // },
    // productDetailArr: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: Product_customer_detail
    // }]
})

module.exports = mongoose.model('products-customer-return', schema)
