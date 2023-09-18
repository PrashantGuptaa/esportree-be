const jwt = require("jsonwebtoken");
const { get } = require("lodash");

// Middleware for Token Authorization
const authMiddleware = (req, res, next) => {
  //console.log('Hi')
  try {
    const token = req.headers?.authorization?.split(" ")?.[1] || null; // Authorization: 'Bearer TOKEN'
    //console.log(req.headers)
    if (!token) {
      return res.status(401).json({ error: "Authorization token is missing" });
    }
    //console.log(token)
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.AUTH_PRIVATE_KEY, {
      // to be replaced with public key
      algorithms: ["HS256"],
    });

    // Attach the decoded user ID to the request object
    req.userId = decoded.userId;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      active: decoded.active,
    };

    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};

// Middleware for Active User Check
const activeUserAuthMiddleware = (req, res, next) => {
  try {
    if (!get(req, ["user", "active"])) {
      return res.status(403).json({ error: "User account is inactive" });
    }

    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};

// Combined Middleware (Authorization + Active User Check)
const authPlusActiveUserMiddleware = (req, res, next) => {
  authMiddleware(req, res, (tokenAuthError) => {
    if (tokenAuthError) {
      return res.status(401).json({ error: tokenAuthError });
    }

    // activeUserAuthMiddleware(req, res, (activeUserError) => {
    //   if (activeUserError) {
    //     return res.status(403).json({ error: activeUserError });
    //   }

    next();
    // });
  });
};

module.exports = {
  authMiddleware,
  activeUserAuthMiddleware,
  authPlusActiveUserMiddleware,
};
