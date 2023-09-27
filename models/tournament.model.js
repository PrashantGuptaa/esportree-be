// models/Tournament.js
const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  reward: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  teamSize: { type: String, required: true },
  location: { type: String, required: true },
  entryFees: { type: String, required: true },
  deleted: { type: Boolean, default: false },
},
{ timestamps: true }
);

module.exports = mongoose.model('Tournament', tournamentSchema);
