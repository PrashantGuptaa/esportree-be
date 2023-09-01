// routes/routes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const eventController = require('../controllers/eventController');

const eventsRouter = express.Router();

// Protected route: Create a new event
eventsRouter.post('/add-event', authMiddleware, eventController.createEvent);
eventsRouter.get('/fetch-all-events', eventController.getEvents);
// Route: Fetch a single event by ID
eventsRouter.get('/:id', eventController.getEventById);

// Route: Update an event by ID
eventsRouter.put('/update-event/:id', authMiddleware, eventController.updateEvent);

// Route: Delete an event by ID
eventsRouter.delete('/remove-event/:id', authMiddleware, eventController.deleteEvent);


module.exports = eventsRouter;
