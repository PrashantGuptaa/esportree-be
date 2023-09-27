const jwt = require("jsonwebtoken");
const { get } = require("lodash");

// Middleware for Token Authorization
const authMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization;

  if (!token) {
    return sendResponse(res, 401, "Authentication failed. Token is missing.");
  }

  // Verify the token
  jwt.verify(token, process.env.AUTH_TOKEN, async (err, user) => {
    if (err) {
      return sendResponse(res, 401, "Authentication failed. Invalid token.");
    }

    if (!user || !user.active) {
      return sendResponse(
        res,
        401,
        "Authentication failed. Account not activated."
      );
    }

    // Attach the user's decoded token data to the request object for use in subsequent middleware/routes
    req.userData = user;
    req.userId = user.userId;
    setUserContext(user);

    // Proceed to the next middleware/route
    next();
  });
}

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
