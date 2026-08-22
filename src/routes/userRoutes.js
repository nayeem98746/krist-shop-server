const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/user", userController.getAllUsers);
router.get("/user/:displayName", userController.getUserByDisplayName);
router.post("/user", userController.createUser);
router.patch("/user/:displayName", userController.updateUserPicture);
router.patch("/user/by-id/:_id", userController.updateUserRole);

module.exports = router;
