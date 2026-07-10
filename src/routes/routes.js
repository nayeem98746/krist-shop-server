const express = require('express')
const authRoute = require('./api/auth')
const productRoute = require('./api/productApi')
const route = express.Router()

route.use('/auth' , authRoute )
route.use('/products' , productRoute)


module.exports = route