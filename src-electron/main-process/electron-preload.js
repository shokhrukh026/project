const express = require('express')
const mongoose = require('mongoose')

const app = express()
//ES6 Promises
// mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/my-db', {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to database'))

app.use(express.json())

const productsRouter = require('../routes/products')
app.use('/products', productsRouter)


const customersRouter = require('../routes/customers')
app.use('/customers', customersRouter)


const producersRouter = require('../routes/producers')
app.use('/producers', producersRouter)


app.listen(3000, () => console.log('Server started!'))