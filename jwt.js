const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Exclude the registration and login routes from the authentication check
  if (req.path === "/api/auth/register" || req.path === "/api/auth/login") {
    return next();
  }

  const token = req.headers.authorization;

  if (token == null) {
    return res.sendStatus(401); // Unauthorized if no token provided
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token is invalid
    }
    req.user = user;
    next(); // Proceed to the next middleware
  });
};

module.exports = authenticateToken;
