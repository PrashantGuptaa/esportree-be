// requestIdMiddleware.js
const { v4: uuidv4 } = require('uuid');
const logger = require('../services/logger');

// Middleware to generate and attach a unique request ID to the request object
const requestIdMiddleware = (req, res, next) => {
  console.log("UUID", uuidv4())
  req.logger = logger.child({ requestId: uuidv4(), requestMethod: req.method, requestUrl: req.originalUrl });

  // req.requestId = uuidv4(); // Generate a unique request ID
//   logger.addContext('requestId', req.requestId); // Add request ID to logger metadata
  next();
};

module.exports = requestIdMiddleware;
