// routes/routes.js
const express = require("express");
const {
  authMiddleware,
  authPlusActiveUserMiddleware,
} = require("../middlewares/authMiddleware");
const eventController = require("../controllers/eventController");

const eventsRouter = express.Router();

// Protected route: Create a new event
eventsRouter.post(
  "/add-event",
  authPlusActiveUserMiddleware,
  eventController.createEvent
);
eventsRouter.get("/fetch-all-events", eventController.getEvents);
// Route: Fetch a single event by ID
eventsRouter.get("/:id", eventController.getEventById);

// Route: Update an event by ID
eventsRouter.put(
  "/update-event/:id",
  authPlusActiveUserMiddleware,
  eventController.updateEvent
);

// Route: Delete an event by ID
eventsRouter.delete(
  "/remove-event/:id",
  authPlusActiveUserMiddleware,
  eventController.deleteEvent
);

eventsRouter.get(
  "/:id/registered-users",
  authPlusActiveUserMiddleware,
  eventController.getRegisteredUsers
);

eventsRouter.post(
  "/:id/register",
  authPlusActiveUserMiddleware,
  eventController.registerUserForEvent
);

eventsRouter.post(
  "/:id/unregister",
  authPlusActiveUserMiddleware,
  eventController.unregisterUserFromEvent
);

// Duplicate - verify and remove
eventsRouter.get(
  "/:id/registered-users-details",
  authPlusActiveUserMiddleware,
  eventController.getRegisteredUsersDetails
);

module.exports = eventsRouter;
