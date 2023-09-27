// logger.js
const { v4 } = require("uuid");
const winston = require("winston");
const httpContext = require("express-http-context");

// Define the log levels and corresponding colors
const logLevels = {
  error: "error",
  warn: "warn",
  info: "info",
  debug: "debug",
};

// Create a Winston logger instance
const logger = winston.createLogger({
  levels: logLevels,
  defaultMeta: { ["Request-Id"]: v4() },
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    // requestIdFormat({ requestId: '' }), // Initialize with an empty string
    winston.format.printf(({ timestamp, level, message }) => {
      const requestId = httpContext.get("requestId");
      const email = httpContext.get("email");
      const userId = httpContext.get("userId");

      return `${timestamp} [${level}] [${requestId}] [${userId}] [${email}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    // Add other transports if needed
  ],
});

setUserContext = ({ email, userId }) => {
  httpContext.set("userId", userId);
  httpContext.set("email", email);
};
module.exports = { logger, setUserContext };
