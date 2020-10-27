const mongoose = require('mongoose')
const products = require('./product')

const schema = new mongoose.Schema({
    // _id: new mongoose.Schema.Types.ObjectId(),
    name: String,
    phone: Number,
    companyName: String
    // productArr: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: products
    // }]
})

module.exports = mongoose.model('producers', schema)
