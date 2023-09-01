// controllers/eventController.js
const Event = require("../models/events.model");
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

  try {
    const event = await Event.findOne({ _id: eventId, deleted: false });
    if (!event) {
      sendResponse(res, 404, "Event not found");
      return;
    }
    sendResponse(res, 200, "Event fetched successfully", event);
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

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
