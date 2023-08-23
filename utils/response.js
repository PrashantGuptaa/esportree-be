const sendResponse = (res, status, message, data = null, errors = []) => {
    return res.status(status).json({
      status,
      message,
      data,
      errors,
    });
  };
  
  module.exports = sendResponse;
  