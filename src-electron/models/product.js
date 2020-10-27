const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    barcode: Number,
    name: String,
    amount: Number,
    buyPrice: Number,
    sellPrice: Number,
    description: String
})

module.exports = mongoose.model('products', schema)
