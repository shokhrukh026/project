const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')
const Product = require('../models/product')

//Getting all customers
router.get('/', async (req, res) => {
    try{
        const customer = await Customer.find();
        res.json(customer);
    }catch(error){
        res.status(500).json({message: error.message});
    }
})

//Getting customer's products
router.get('/:id/products', async (req, res) => {
    try{
        await Customer.findById(req.params.id)
        .populate('productArr')
        .exec(async function(error, element){
            if (error) return res.status(400).json({message: error.message})

            res.json(element.productArr);
        })
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//Getting one
router.get('/:id', getCustomer, (req, res) => {
    res.json(res.customer)
})

//Creating one
router.post('/', async (req, res) => {
    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        companyName: req.body.companyName,
    })
    try {
        const newCustomer = await customer.save()
        res.status(201).json(newCustomer)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
// Add product to customer
router.post('/:id/add/product', async (req, res) => {
    try {
        let product = await Product.findOne({name: req.body.productArr.name})

        await Customer.findById(req.params.id)
        .populate('productArr')
        .exec(async function (error, element) {
            if (error) return res.status(400).json({message: error.message})
            product.amount = product.amount - req.body.productArr.amount
            await product.save();
            product.amount = req.body.productArr.amount
            element.productArr.push(product);
            const updatedCustomer = await element.save()
            res.json(updatedCustomer)
        });
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Update one
router.patch('/:id', async (req, res) => {
    let customer = await Customer.findById(req.params.id);
    
    if(req.body.name != null){
        customer.name = req.body.name
    }
    if(req.body.phone != null){
        customer.phone = req.body.phone
    }
    if(req.body.companyName != null){
        customer.companyName = req.body.companyName
    }

    try {
        const updatedCustomer = await customer.save()
        res.json(updatedCustomer)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Update one product of customer
router.patch('/:id/product/:pid', async (req, res) => {
    let product = await Product.findById(req.params.pid);
    switch (true) { 
        case req.body.barcode != null:
            product.barcode = req.body.barcode
        case req.body.name != null:
            product.name = req.body.name
        case req.body.amount != null:
            product.amount = req.body.amount
        case req.body.buyPrice != null:
            product.buyPrice = req.body.buyPrice
        case req.body.sellPrice != null:
            product.sellPrice = req.body.sellPrice
        case req.body.description != null:
            product.description = req.body.description
        // default:
            // res.status(400).json({message: 'error in switch'})
    }

    try {
        const updatedProduct = await product.save()
        res.json(updatedProduct)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Delete one
router.delete('/:id', async (req, res) => {
    let customer = await Customer.findById(req.params.id);
    try {
        await customer.remove()
        res.json({message: 'Customer deleted!', deleted: true})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Delete one product of customer
router.delete('/:id/product/:pid', async (req, res) => {
    try {
        let product = await Product.findById(req.params.pid)

        await Customer.findById(req.params.id)
        .populate('productArr')
        .exec(async function (error, element) {
            if (error) return res.status(400).json({message: error.message})
            console.log(element);

            let arrayIndex = await element.productArr.findIndex(function( currentValue ) {
                return currentValue._id == req.params.pid; 
            })
            console.log(arrayIndex);
            await product.remove();
            
            await element.productArr.splice(arrayIndex, 1);
            console.log(element.productArr);
            await element.save()
            res.json({message: 'Product of customer deleted!', deleted: true})
        });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

async function getCustomer(req, res, next){
    // let customer;
    // try {
        // customer = await Customer.findById(req.params.id)
        // .populate('product')
        // .then(function (err, element) {
        //     if (err) return res.status(404).json({ message: 'Cannot find customer', error: err })
        //     console.log('The customer is %s', element);
        // });
        // if(customer == null){
        //     return res.status(404).json({ message: 'Cannot find customer' })
        // }
    // } catch (error) {
    //     return res.status(500).json({ message: error.message })   
    // }
    // res.customer = customer
    next()
}

module.exports = router