const express = require('express')
const authRoute = require('./api/auth')
const productRoute = require('./api/productApi')
const eventRoute = require('./api/eventApi')
const route = express.Router()

route.use('/auth' , authRoute )
route.use('/products' , productRoute)
route.use('/events' , eventRoute)


module.exports = route