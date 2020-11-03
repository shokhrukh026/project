const express = require('express')
const router = express.Router()
const Producer = require('../models/producer')
const Product = require('../models/product')

//Getting all producers
router.get('/', async (req, res) => {
    try{
        const producer = await Producer.find();
        res.json(producer);
    }catch(error){
        res.status(500).json({message: error.message});
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
    // const producer = new Producer({
    //     productArr: req.body.productArr
    // })
    // try {
    //     const newCustomer = await producer.save()
    //     res.status(201).json(newCustomer)
    // } catch (error) {
    //     res.status(400).json({message: error.message})
    // }
    // console.log(res);
    
    try {
        const product = new Product(req.body.productArr)

        await Producer.findById(req.params.id)
        .populate('productArr')
        .exec(async function (error, element) {
            if (error) return res.status(400).json({message: error.message})

            await product.save();
            element.productArr.push(product);
    
            const updatedProducer = await element.save()
            res.json(updatedProducer)
        });




        // .then(async (e) => {
        //     e.productArr.push(product);
        //     console.log(e);
    
        //     const updatedProducer = await e.save()
        //     res.json(updatedProducer)
        // });
    } catch (error) {
        res.status(400).json({message: error.message})
    }


    // try {
    //     const updatedProducer = await res.producer.save()
    //     res.json(updatedProducer)
    // } catch (error) {
    //     res.status(400).json({message: error.message})
    // }
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
        let product = await Product.findById(req.params.pid)

        await Producer.findById(req.params.id)
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
            res.json({message: 'Product of producer deleted!', deleted: true})
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