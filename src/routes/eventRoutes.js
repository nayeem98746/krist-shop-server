const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const verifyToken = require("../middleware/tokenVerification");
const checkRole = require("../middleware/middleware");

router.get("/events/", eventController.getEvents);
router.post("/events/", verifyToken, checkRole, eventController.createEvent);
router.delete("/events/:_id", verifyToken, checkRole, eventController.deleteEvent);

module.exports = router;
