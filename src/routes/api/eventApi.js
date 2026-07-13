 

const express = require('express');
const productRoute = express.Router();
const jwtTokenVerification = require('../../middleware/tokenVerification');
const checkRole = require('../../middleware/middleware');
 const upload = require('../../middleware/multer');
const { getAllEvents, createEvent, updateEvent, deleteEvent,  getEventById, getEventsByTitle } = require('../../controller/eventController');

 
productRoute.post('/AllEvents',  createEvent);
productRoute.get('/AllEvents', getAllEvents);
productRoute.get('/AllEvents/:id', getEventById);
productRoute.get('/AllEvents/search/title', getEventsByTitle);
productRoute.put('/AllEvents/:id', updateEvent);
productRoute.delete('/AllEvents/:id', deleteEvent);

 

module.exports = productRoute;

 