const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/tokenVerification");
const checkRole = require("../middleware/middleware");

router.get("/user", verifyToken, checkRole, userController.getAllUsers);
router.get("/user/:displayName", userController.getUserByDisplayName);
router.post("/user", userController.createUser);
router.patch("/user/:displayName", verifyToken, userController.updateUserPicture);
router.patch("/user/by-id/:_id", verifyToken, checkRole, userController.updateUserRole);

module.exports = router;
