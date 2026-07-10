// const express = require('express')
// const productRoute = express.Router()
// const jwtTokenVerification = require('../../middleware/tokenVerification')
// const checkRole = require('../../middleware/middleware')
// const { createProduct, updateProduct, deleteProduct, getAllProducts, getSingleProduct } = require('../../controller/productController')
// const upload = require('../../middleware/multer')



// productRoute.post('/getAllProducts', jwtTokenVerification, checkRole,  upload.single('image'), createProduct)
// productRoute.post('/getSingleProduct' , getAllProducts, getSingleProduct , updateProduct, deleteProduct)




//   module.exports = productRoute

const express = require('express');
const productRoute = express.Router();
const jwtTokenVerification = require('../../middleware/tokenVerification');
const checkRole = require('../../middleware/middleware');
const { createProduct, updateProduct, deleteProduct, getAllProducts, getSingleProduct } = require('../../controller/productController');
const upload = require('../../middleware/multer');

productRoute.post('/create', jwtTokenVerification, upload.single('image'), createProduct);
productRoute.get('/all', getAllProducts);  
productRoute.get('/:id', getSingleProduct);  
productRoute.put('/:id', jwtTokenVerification, upload.single('image'), updateProduct);
productRoute.delete('/:id', jwtTokenVerification, deleteProduct);

module.exports = productRoute;