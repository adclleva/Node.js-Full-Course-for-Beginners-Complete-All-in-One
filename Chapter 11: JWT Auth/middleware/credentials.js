const allowOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowOrigins.includes(origin)) {
    // this is since CORS needs the Access-Control-Allow-Origin header to be set to the origin of the request
    res.setHeader("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credentials;
