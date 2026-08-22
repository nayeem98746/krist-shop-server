const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/men", productController.getMen);
router.get("/men/:id", productController.getManById);
router.get("/women", productController.getWomen);
router.get("/foot", productController.getFoot);
router.get("/kids", productController.getKids);
router.get("/b&f", productController.getBAndF);

router.get("/AllProduct", productController.getAllProducts);
router.get("/AllProduct/category/:category", productController.getProductsByCategory);
router.get("/AllProduct/detail/:_id", productController.getProductDetail);
router.get("/AllProduct/single_payment/:_id", productController.getProductForPayment);
router.post("/AllProduct/", productController.addProduct);
router.patch("/AllProduct/:_id", productController.updateProduct);
router.delete("/AllProduct/:_id", productController.deleteProduct);

module.exports = router;
