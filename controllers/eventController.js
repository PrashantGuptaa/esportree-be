// controllers/eventController.js
const Event = require("../models/events.model");
const logger = require("../services/logger");
const sendResponse = require("../utils/response");

const createEvent = async (req, res) => {
  const {
    eventName,
    description,
    dateTime,
    location,
    influencerList,
    ageRestriction,
    price,
    contactDetails,
    maxGathering,
    hashtag,
    disclaimer,
    sponsors,
  } = req.body;

  // Array of required fields
  const requiredFields = [
    "eventName",
    "description",
    "dateTime",
    "location",
    "influencerList",
    "ageRestriction",
    "price",
    "contactDetails",
    "maxGathering",
    "hashtag",
    "disclaimer",
    "sponsors",
  ];

  // Check if all required fields are present
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    sendResponse(
      res,
      400,
      `Missing required fields: ${missingFields.join(", ")}`
    );
    return;
  }

  try {
    const newEvent = new Event({
      userId: req.userId,
      eventName,
      description,
      dateTime,
      location,
      influencerList,
      ageRestriction,
      price,
      contactDetails,
      maxGathering,
      hashtag,
      disclaimer,
      sponsors,
    });

    await newEvent.save();

    sendResponse(res, 201, "Event created successfully", newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    sendResponse(res, 500, "Failed to create event", null, [error.message]);
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ deleted: false });
    sendResponse(res, 200, "Events fetched successfully", events);
  } catch (error) {
    console.error("Error fetching events:", error);
    sendResponse(res, 500, "Failed to fetch events", null, [error.message]);
  }
};

// Fetch a single event by ID
const getEventById = async (req, res) => {
  const eventId = req.params.id;
  req.logger.info(`Fetching event with event Id: ${eventId}`);

  try {
    const event = await Event.findOne({ _id: eventId, deleted: false });
    if (!event) {
      sendResponse(res, 404, "Event not found");
      return;
    }

    // Calculate the count of registered users
    const registeredUsersCount = event.registeredUsers.length;

    // Create a response object with the event details and registered users count
    const eventDetails = {
      ...event.toObject(),
      registeredUsers: undefined, // Remove registeredUsers
      registeredUsersCount, // Add registeredUsersCount
    };
    sendResponse(res, 200, "Event fetched successfully", eventDetails);
  } catch (error) {
    console.error("Error fetching event:", error);
    sendResponse(res, 500, "Failed to fetch event", null, [error.message]);
  }
};

// Update an event by ID
const updateEvent = async (req, res) => {
  const eventId = req.params.id;
  const updateData = req.body;

  try {
    const event = await Event.findByIdAndUpdate(eventId, updateData, {
      new: true,
    });
    if (!event) {
      sendResponse(res, 404, "Event not found");
      return;
    }
    sendResponse(res, 200, "Event updated successfully", event);
  } catch (error) {
    console.error("Error updating event:", error);
    sendResponse(res, 500, "Failed to update event", null, [error.message]);
  }
};

// Delete an event by ID
const deleteEvent = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findByIdAndUpdate(
      eventId,
      { deleted: true },
      { new: true }
    );
    if (!event) {
      sendResponse(res, 404, "Event not found");
      return;
    }
    sendResponse(res, 200, "Event deleted successfully");
  } catch (error) {
    console.error("Error deleting event:", error);
    sendResponse(res, 500, "Failed to delete event", null, [error.message]);
  }
};

// Fetch registered users for an event
const getRegisteredUsers = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId).populate(
      "registeredUsers",
      "email"
    );
    if (!event) {
      sendResponse(res, 404, "Event not found");
      return;
    }

    const registeredUsers = event.registeredUsers;
    sendResponse(
      res,
      200,
      "Registered users fetched successfully",
      registeredUsers
    );
  } catch (error) {
    console.error("Error fetching registered users:", error);
    sendResponse(res, 500, "Failed to fetch registered users", null, [
      error.message,
    ]);
  }
};

// Register a user for an event
const registerUserForEvent = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.userId;

  try {
    // Check if the user is already registered for the event
    const event = await Event.findById(eventId);
    if (!event) {
      sendResponse(res, 404, "Event not found");
      return;
    }

    const isAlreadyRegistered = event.registeredUsers.includes(userId);
    if (isAlreadyRegistered) {
      sendResponse(res, 400, "User is already registered for this event");
      return;
    }

    // Add the user to the list of registered users for the event
    event.registeredUsers.push(userId);
    await event.save();

    sendResponse(res, 200, "User registered for the event successfully");
  } catch (error) {
    console.error("Error registering user for the event:", error);
    sendResponse(res, 500, "Failed to register user for the event", null, [
      error.message,
    ]);
  }
};

// Unregister a user from an event
const unregisterUserFromEvent = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.userId;

  try {
    // Check if the user is registered for the event
    const event = await Event.findById(eventId);
    if (!event) {
      sendResponse(res, 404, "Event not found");
      return;
    }

    const isRegistered = event.registeredUsers.includes(userId);
    if (!isRegistered) {
      sendResponse(res, 400, "User is not registered for this event");
      return;
    }

    // Remove the user from the list of registered users for the event
    event.registeredUsers = event.registeredUsers.filter(
      (registeredUserId) => registeredUserId.toString() !== userId.toString()
    );
    await event.save();

    sendResponse(res, 200, "User unregistered from the event successfully");
  } catch (error) {
    console.error("Error unregistering user from the event:", error);
    sendResponse(res, 500, "Failed to unregister user from the event", null, [
      error.message,
    ]);
  }
};

// Fetch all user details registered for an event
// Duplicate - verify and remove
const getRegisteredUsersDetails = async (req, res) => {
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      sendResponse(res, 404, "Event not found");
      return;
    }

    // Fetch details of registered users using their IDs
    const registeredUserIds = event.registeredUsers.filter((userId) => userId);
    const registeredUsersDetails = await User.find({
      _id: { $in: registeredUserIds },
    });

    sendResponse(
      res,
      200,
      "Registered users details fetched successfully",
      registeredUsersDetails
    );
  } catch (error) {
    console.error("Error fetching registered users details:", error);
    sendResponse(res, 500, "Failed to fetch registered users details", null, [
      error.message,
    ]);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getRegisteredUsers,
  registerUserForEvent,
  unregisterUserFromEvent,
  getRegisteredUsersDetails,
};
