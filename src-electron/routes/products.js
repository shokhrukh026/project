const express = require('express')
const router = express.Router()
const Product = require('../models/product')

//Getting all
router.get('/', async (req, res) => {
    try{
        const products = await Product.find()
        res.json(products)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})
//Getting one
router.get('/:id', getProduct, (req, res) => {
    res.json(res.product)
})
//Filter by name 
router.get('/filter/by/:name', async (req, res) => {
    let product;
    try {
        product = await Product.find({name: { "$regex": req.params.name, "$options": "i" }});
        res.json(product)
    } catch (error) {
        res.status(500).json({message: error.message})
    }  
})
//Creating one
router.post('/', async (req, res) => {
    const product = new Product({
        barcode: req.body.barcode,
        name: req.body.name,
        amount: req.body.amount,
        buyPrice: req.body.buyPrice,
        sellPrice: req.body.sellPrice,
        description: req.body.description
    })
    try {
        const newProduct = await product.save()
        res.status(201).json(newProduct)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
// //Updating one
// router.patch('/', getProduct, async (req, res) => {
//     if(req.body.name != null){
//         res.product.name = req.body.name
//     }
//     if(req.body.barcode != null){
//         res.product.barcode = req.body.barcode
//     }
//     try {
//         const updatedProduct = await res.product.save()
//         res.json(updatedProduct)
//     } catch (error) {
//         res.status(400).json({message: error.message})
//     }
// })
// //Deleting one
// router.delete('/:id', getProduct, async (req, res) => {
//     try {
//         await res.product.remove()
//         res.json({message: 'Deleted Product'})
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// })

async function getProduct(req, res, next){
    let product
    try {
        product = await Product.findById(req.params.id)
        if(product == null){
            return res.status(404).json({ message: 'Cannot find product' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })   
    }
    res.product = product
    next()
}

module.exports = router