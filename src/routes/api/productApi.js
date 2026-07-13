 

const express = require('express');
const productRoute = express.Router();
const jwtTokenVerification = require('../../middleware/tokenVerification');
const checkRole = require('../../middleware/middleware');
const { createProduct, updateProduct, deleteProduct, getAllProducts, getSingleProduct } = require('../../controller/productController');
const upload = require('../../middleware/multer');

productRoute.post('/create', jwtTokenVerification, upload.single('image'), createProduct);
productRoute.post('/CreateAllProduct', createProduct);  
productRoute.get('/AllProduct', getAllProducts);  
// event collection 
  




// productRoute.get('/AllProduct/:id', getSingleProduct);  

// productRoute.put('/men/:id', jwtTokenVerification, upload.single('image'), updateProduct);
// productRoute.delete('/men/:id', jwtTokenVerification, deleteProduct);

module.exports = productRoute;

 