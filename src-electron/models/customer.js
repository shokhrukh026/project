const mongoose = require('mongoose')
const Products_customer = require('./product-customer')

const schema = new mongoose.Schema({
    // _id: new mongoose.Schema.Types.ObjectId(),
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: false,
    },
    companyName: {
        type: String,
        required: false,
    },
    productArr: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Products_customer
    }]
})

module.exports = mongoose.model('customers', schema)
