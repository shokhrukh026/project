const express = require('express')
const router = express.Router()
const Producer = require('../models/producer')
const Product_producer = require('../models/product-producer')
const Product_producer_detail = require('../models/product-producer-detail')


//Getting all producers
router.get('/', async (req, res) => {
    try{
        const producer = await Producer.find();
        res.json(producer);
    }catch(error){
        res.status(500).json({message: error.message});
    }
})
//Filter by name 
router.get('/filter/by/:name', async (req, res) => {
    let product;
    try {
        product = await Product_producer.find({name: { "$regex": req.params.name, "$options": "i" }});
        res.json(product)
    } catch (error) {
        res.status(500).json({message: error.message})
    }  
})
//Getting producer's products
router.get('/:id/products', async (req, res) => {
    try{
        await Producer.findById(req.params.id)
        .populate('productArr')
        .exec(async function(error, element){
            if (error) return res.status(400).json({message: error.message})

            res.json(element.productArr);
        })
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//Getting producer product's detail
router.get('/:id/product/detail', async (req, res) => {
    try{
        await Product_producer.findById(req.params.id)
        .populate('productDetailArr')
        .exec(async function(error, element){
            if (error) return res.status(400).json({message: error.message})

            res.json(element.productDetailArr);
        })
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//Getting one
router.get('/:id', getProducer, (req, res) => {
    res.json(res.producer)
})

//Creating one
router.post('/', async (req, res) => {
    const producer = new Producer({
        name: req.body.name,
        phone: req.body.phone,
        companyName: req.body.companyName,
    })
    try {
        const newCustomer = await producer.save()
        res.status(201).json(newCustomer)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
// Add product to producer
router.post('/:id/add/product', async (req, res) => {
    try {
        const product = new Product_producer(req.body.productArr)

        await Producer.findById(req.params.id)
        .populate('productArr')
        .exec(async function (error, element) {
            if (error) return res.status(400).json({message: error.message})

            await product.save();
            element.productArr.push(product);
    
            const updatedProducer = await element.save()
            res.json(updatedProducer)
        });
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//Add product detail to producer's product
router.post('/product/:pid/add/detail/', async (req, res) => {
    console.log(req);
    try {
        const product_detail = new Product_producer_detail(req.body.productDetailArr)

        await Product_producer.findById(req.params.pid)
        .populate('productDetailArr')
        .exec(async function (error, element) {
            if (error) return res.status(400).json({message: error.message})
            console.log(element);
            await product_detail.save();
            element.productDetailArr.push(product_detail);
    
            const updatedProductDetail = await element.save()
            res.json(updatedProductDetail)
        });
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//Update one
router.patch('/:id', async (req, res) => {
    let producer = await Producer.findById(req.params.id);
    
    if(req.body.name != null){
        producer.name = req.body.name
    }
    if(req.body.phone != null){
        producer.phone = req.body.phone
    }
    if(req.body.companyName != null){
        producer.companyName = req.body.companyName
    }

    try {
        const updatedProducer = await producer.save()
        res.json(updatedProducer)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Update one product of producer
router.patch('/:id/product/:pid', async (req, res) => {
    let product = await Product_producer.findById(req.params.pid);
    switch (true) { 
        case req.body.barcode != null:
            product.barcode = req.body.barcode
        case req.body.name != null:
            product.name = req.body.name
        case req.body.amount != null:
            product.amount = req.body.amount
        case req.body.measure != null:
            product.measure = req.body.measure
        // case req.body.buyPrice != null:
        //     product.buyPrice = req.body.buyPrice
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
//Update one detail of product of producer
router.patch('/product/detail/:did', async (req, res) => {
    let product = await Product_producer_detail.findById(req.params.did);
    switch (true) { 
        case req.body.date != null:
            product.date = req.body.date
        case req.body.amount != null:
            product.amount = req.body.amount
        case req.body.amountLeft != null:
            product.amountLeft = req.body.amountLeft
        case req.body.buyPrice != null:
            product.buyPrice = req.body.buyPrice
        case req.body.sellPrice != null:
            product.sellPrice = req.body.sellPrice
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
        const updatedProductDetail = await product.save()
        res.json(updatedProductDetail)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Delete one
router.delete('/:id', async (req, res) => {
    let producer = await Producer.findById(req.params.id);
    try {
        await producer.remove()
        res.json({message: 'Producer deleted!', deleted: true})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Delete one product of producer
router.delete('/:id/product/:pid', async (req, res) => {
    try {
        let product = await Product_producer.findById(req.params.pid)

        await Producer.findById(req.params.id)
        .populate('productArr')
        .exec(async function (error, element) {
            if (error) return res.status(400).json({message: error.message})

            let arrayIndex = await element.productArr.findIndex(function( currentValue ) {
                return currentValue._id == req.params.pid; 
            })
            await product.remove();
            
            await element.productArr.splice(arrayIndex, 1);
            await element.save()
            res.json({message: 'Product of producer deleted!', deleted: true})
        });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//Delete one detail of one product of producer
router.delete('/product/:pid/detail/:did', async (req, res) => {
    try {
        let product_detail = await Product_producer_detail.findById(req.params.did)

        await Product_producer.findById(req.params.pid)
        .populate('productDetailArr')
        .exec(async function (error, element) {
            if (error) return res.status(400).json({message: error.message})

            let arrayIndex = await element.productDetailArr.findIndex(function( currentValue ) {
                return currentValue._id == req.params.did; 
            })
            await product_detail.remove();
            
            await element.productDetailArr.splice(arrayIndex, 1);
            await element.save()
            res.json({message: 'Detail of one product of producer deleted!', deleted: true})
        });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})




















async function getProducer(req, res, next){
    // let producer;
    // try {
        // producer = await Producer.findById(req.params.id)
        // .populate('product')
        // .then(function (err, element) {
        //     if (err) return res.status(404).json({ message: 'Cannot find producer', error: err })
        //     console.log('The producer is %s', element);
        // });
        // if(producer == null){
        //     return res.status(404).json({ message: 'Cannot find producer' })
        // }
    // } catch (error) {
    //     return res.status(500).json({ message: error.message })   
    // }
    // res.producer = producer
    next()
}

module.exports = router