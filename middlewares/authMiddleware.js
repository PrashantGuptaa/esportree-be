// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'

  if (!token) {
    return res.status(401).json({ error: 'Authorization token is missing' });
  }



  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.AUTH_PRIVATE_KEY,  { // to be replaced eith public key
        algorithms: ['HS256'], // Use the desired algorithm
      });

    // Attach the decoded user ID to the request object
    req.userId = decoded.userId;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: 'Invalid token', error });
  }
};

module.exports = authMiddleware;
