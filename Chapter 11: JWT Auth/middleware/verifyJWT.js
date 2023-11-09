// we added this verifyJWT middleware to check if the user is authenticated
// we add it the routes that we want to protect

const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // if there is no authorization header, then the user is not authenticated
    return res.sendStatus(401); // Unauthorized
  }
  console.log({ authHeader });
  const token = authHeader.split(" ")[1]; // Bearer <token>

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // if there is an error verifying the token
      return res.sendStatus(403); // Forbidden or invalid token
    }

    // if the token is valid, then we attach the user to the request object
    req.user = decoded.username;
    next();
  });
};

module.exports = verifyJWT;
