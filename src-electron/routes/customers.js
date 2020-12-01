const express = require('express')
const router = express.Router()
const Customer = require('../models/customer')
const Product_producer = require('../models/product-producer')
const Product_customer = require('../models/product-customer')
const Product_producer_detail = require('../models/product-producer-detail')
const Product_customer_return = require('../models/product-customer-return')


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
//Getting all returned products
router.get('/get/all/return/products', async (req, res) => {
    try{
        const return_products = await Product_customer_return.find();
        res.json(return_products);
    }catch(error){
        res.status(500).json({message: error.message});
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
        let productNew = await new Product_customer(req.body.productArr)
        await Product_producer.findOne({_id: req.body.productArr.product_id})
        .populate({
            path: 'productDetailArr',
        })
        .exec(async function (error, element) {
            if (error) return res.status(400).json({message: error.message})
            let amount = productNew.amount
            for(let i = 0; i < element.productDetailArr.length; i++){
                let producer_product_detail = await Product_producer_detail.findById(element.productDetailArr[i].id)
                if(productNew.amount <= element.productDetailArr[i].amountLeft){
                    producer_product_detail.amountLeft = producer_product_detail.amountLeft - amount
                    await producer_product_detail.save();
                    break;
                }else{
                    amount = amount - producer_product_detail.amountLeft
                    producer_product_detail.amountLeft = 0
                    await producer_product_detail.save();
                }
            }
            await element.save();//?
        });

        await Customer.findById(req.params.id)
        .populate('productArr')
        .exec(async function (error, element) {
            if (error) return res.status(400).json({message: error.message})
            // product.amount = product.amount - req.body.productArr.amount
            // await product.save();
            await productNew.save();
            await element.productArr.push(productNew);
            const updatedCustomer = await element.save();
            res.json(updatedCustomer)
        });
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

// Add product return to producer from customer
router.post('/:cid/add/product/return/:pid', async (req, res) => {
    try {
        let product = await Product_customer.findById(req.params.pid)
        product.amount = product.amount - req.body.amount

        let productNew = await new Product_customer_return(req.body)
        await product.save();
        await productNew.save();
        res.json('success')
     
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
    let product = await Product_customer.findById(req.params.pid);
    switch (true) { 
        case req.body.barcode != null:
            product.barcode = req.body.barcode
        case req.body.date != null:
            product.date = req.body.date
        case req.body.name != null:
            product.name = req.body.name
        case req.body.amount != null:
            product.amount = req.body.amount
        case req.body.measure != null:
            product.measure = req.body.measure
        case req.body.buyPrice != null:
            product.buyPrice = req.body.buyPrice
        case req.body.payed != null:
            product.payed = req.body.payed
        case req.body.unPayed != null:
            product.unPayed = req.body.unPayed
        case req.body.about != null:
            product.about = req.body.about
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
//Update one returned product of customer
router.patch('/edit/return/product/:id', async (req, res) => {
    let product = await Product_customer_return.findById(req.params.id);
    switch (true) { 
        case req.body.amount != null:
            product.amount = req.body.amount
        case req.body.measure != null:
            product.measure = req.body.measure
        case req.body.buyPrice != null:
            product.buyPrice = req.body.buyPrice
        case req.body.returnReason != null:
            product.returnReason = req.body.returnReason
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
        let product = await Product_customer.findById(req.params.pid)

        await Customer.findById(req.params.id)
        .populate('productArr')
        .exec(async function (error, element) {
            if (error) return res.status(400).json({message: error.message})

            let arrayIndex = await element.productArr.findIndex(function( currentValue ) {
                return currentValue._id == req.params.pid; 
            })
            await product.remove();
            
            await element.productArr.splice(arrayIndex, 1);
            await element.save()
            res.json({message: 'Product of customer deleted!', deleted: true})
        });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
//Delete one returned product of customer
router.delete('/delete/return/product/:id', async (req, res) => {
    try {
        let product = await Product_customer_return.findById(req.params.id)
        await product.remove();
        res.json({message: 'Returned product of customer deleted!', deleted: true})
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