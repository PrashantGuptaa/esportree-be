// controllers/jobsController.js
const Jobs = require("../models/jobs.model");
const sendResponse = require("../utils/response");

const create = async (req, res) => {
  try {
    const { title, business, location, language, level, sectorTags, employmentType, experienceLevel, isRemote } = req.body;

    if (!(title || business || location || language || level || sectorTags || employmentType || experienceLevel)) {
        sendResponse(res, 400, 'Missing required fields');
        return;
    }

    const job = new Jobs({
        userId: req.userId,
        title,
        business,
        location,
        language,
        level,
        sectorTags,
        employmentType,
        experienceLevel,
        isRemote,
    });
    job.save();
    sendResponse(res, 200, "Job created successfully", job);
  } catch (error) {
    sendResponse(res, 500, "Failed to created the job", null, [
      error.message,
    ]);
  }
};

const list = async (req, res) => {
  try {
    const { title, business, location, language, level, sectorTags, employmentType, experienceLevel, isRemote, page = 1, limit = 10 } = req.body;

    const titleSearch = [];
    if (title) {
        titleSearch.push({
            $match: {
                title: { $regex: new RegExp(title, 'i') },
            }
        });
    }
    const businessSearch = [];
    if (business) {
        businessSearch.push({
            $match: {
                business: { $regex: new RegExp(business, 'i') },
            }
        });
    }
    const locationSearch = [];
    if (location) {
        locationSearch.push({
            $match: {
                location: { $regex: new RegExp(location, 'i') },
            }
        });
    }
    const languageSearch = [];
    if (language) {
        languageSearch.push({
            $match: {
                language: { $regex: new RegExp(language, 'i') },
            }
        });
    }
    const remoteSearch = [];
    if (isRemote) {
        remoteSearch.push({
            $match: {
                isRemote
            }
        });
    }

    const levelFilter = [];
    if (level) {
        levelFilter.push({
            $match: {
                level,
            }
        });
    }
    const sectorTagsFilter = [];
    if (sectorTags) {
        sectorTagsFilter.push({
            $match: {
                sectorTags,
            }
        });
    }
    const employmentTypeFilter = [];
    if (employmentType) {
        employmentTypeFilter.push({
            $match: {
                employmentType,
            }
        });
    }
    const experienceLevelFilter = [];
    if (experienceLevel) {
        experienceLevelFilter.push({
            $match: {
                experienceLevel,
            }
        });
    }
    const filters = [
        ...titleSearch,
        ...businessSearch,
        ...locationSearch,
        ...languageSearch,
        ...remoteSearch,
        ...levelFilter,
        ...sectorTagsFilter,
        ...employmentTypeFilter,
        ...experienceLevelFilter
    ];

    const jobs = await Jobs.aggregate([
        ...filters,
        {
            $sort: {
                createdAt: -1,
            }
        },
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: limit,
        }
    ]);
    sendResponse(res, 200, "Jobs fetched successfully", jobs);
  } catch (error) {
    sendResponse(res, 500, "Failed to fetch the jobs", null, [
      error.message,
    ]);
  }
};


module.exports = {
  create,
  list,
};
