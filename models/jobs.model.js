// models/jobs.js
const mongoose = require('mongoose');

const jobsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    business: { type: String, required: true },
    location: { type: String, required: true },
    language: { type: String, required: true },
    level: { type: Number, required: true },
    sectorTags: { type: Number, required: true },
    employmentType: { type: Number, required: true },
    experienceLevel: { type: Number, required: true },
    isRemote: { type: Boolean, required: true, default: false },
}, {
    timestamps: true,
});

const Jobs = mongoose.model('Jobs', jobsSchema);

module.exports = Jobs;
