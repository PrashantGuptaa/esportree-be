const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  eventName: { type: String, required: true },
  description: { type: String, required: true },
  dateTime: { type: Date, required: true },
  location: { type: String, required: true },
  influencerList: [{ type: String }],
  ageRestriction: { type: String },
  price: { type: Number },
  contactDetails: { type: String },
  maxGathering: { type: Number },
  hashtag: { type: String },
  disclaimer: { type: String },
  sponsors: [{ type: String }],
  deleted: { type: Boolean, default: false }, // Soft delete indicator
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },    // Automatically updated whenever the document is modified
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
