const mongoose = require('mongoose')
const Product_producer = require('./product-producer')

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
        ref: Product_producer
    }]
})

module.exports = mongoose.model('producers', schema)
