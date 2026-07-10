const express = require('express')
const { loginController, registerController } = require('../../controller/authController')
const authRoute = express.Router()

authRoute.post('/registration' , registerController)
authRoute.post('/login' , loginController)


module.exports = authRoute