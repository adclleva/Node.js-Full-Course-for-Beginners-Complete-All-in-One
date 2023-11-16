/**
 * this config file is used to configure the CORS middleware
 */
const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  // the origin property is a function that takes the origin as a parameter
  origin: (origin, callback) => {
    // we probably would need to remove the !origin check in production
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // no error, allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // error, don't allow the request
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers choke on 204
};

module.exports = corsOptions;
