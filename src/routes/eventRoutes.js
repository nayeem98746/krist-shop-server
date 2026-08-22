const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.get("/events/", eventController.getEvents);
router.post("/events/", eventController.createEvent);
router.delete("/events/:_id", eventController.deleteEvent);

module.exports = router;
