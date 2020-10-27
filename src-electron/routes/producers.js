const express = require('express')
const router = express.Router()
const Producer = require('../models/producer')
const product = require('../models/product')

//Getting all
router.get('/', async (req, res) => {
    try{
        const producers = await Producer.find()
        res.json(producers)
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
//Add product to producer
// router.post('/', async (req, res) => {
//     const producer = new Producer({
//         productArr: req.body.productArr
//     })
//     try {
//         const newCustomer = await producer.save()
//         res.status(201).json(newCustomer)
//     } catch (error) {
//         res.status(400).json({message: error.message})
//     }
// })

// //Updating one
// router.patch('/', getProducer, async (req, res) => {
//     if(req.body.name != null){
//         res.producer.name = req.body.name
//     }
  
//     try {
//         const updatedCustomer = await res.producer.save()
//         res.json(updatedCustomer)
//     } catch (error) {
//         res.status(400).json({message: error.message})
//     }
// })
// //Deleting one
// router.delete('/:id', getProducer, async (req, res) => {
//     try {
//         await res.producer.remove()
//         res.json({message: 'Deleted Producer'})
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// })

async function getProducer(req, res, next){
    let producer;
    try {
        producer = await Producer.findById(req.params.id)
        .populate(product)
        .exec(function (err, element) {
            if (err) return res.status(404).json({ message: 'Cannot find producer', error: err })
            console.log('The producer is %s', element);
        });
        // if(producer == null){
        //     return res.status(404).json({ message: 'Cannot find producer' })
        // }
    } catch (error) {
        return res.status(500).json({ message: error.message })   
    }
    res.producer = producer
    next()
}

module.exports = router