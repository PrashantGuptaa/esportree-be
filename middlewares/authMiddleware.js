const jwt = require('jsonwebtoken');
const { get } = require('lodash');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(' ')?.[1] || null; // Authorization: 'Bearer TOKEN'
  if (!token) {
    return res.status(401).json({ error: 'Authorization token is missing' });
  }



    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.AUTH_PRIVATE_KEY,  { // to be replaced eith public key
        algorithms: ['HS256'], // Use the desired algorithm
      });

    // Attach the decoded user ID to the request object
    req.userId = decoded.userId;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};

module.exports = authMiddleware;
