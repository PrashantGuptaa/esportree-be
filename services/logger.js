// logger.js
const winston = require('winston');

// Define the log levels and corresponding colors
const logLevels = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
};

// Create a Winston logger instance
const logger = winston.createLogger({
  levels: logLevels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    // requestIdFormat({ requestId: '' }), // Initialize with an empty string
    winston.format.printf(({ timestamp, level, message, requestId }) => {
      console.log(Object.keys(requestId).length)
      return `${timestamp} [${level}] [${requestId}] ${message}`; 
    })
  ),
  transports: [
    new winston.transports.Console(),
    // Add other transports if needed
  ],
});

module.exports = logger;
