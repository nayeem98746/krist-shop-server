const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

router.get("/addressAPI", addressController.getAddressAPI);
router.get("/address", addressController.getAllAddresses);
router.get("/address/:user_name", addressController.getAddressByUserName);
router.post("/address", addressController.createAddress);
router.delete("/address/:_id", addressController.deleteAddress);

module.exports = router;
