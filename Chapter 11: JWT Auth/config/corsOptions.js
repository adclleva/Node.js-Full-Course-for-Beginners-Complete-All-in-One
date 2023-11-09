/**
 * this config file is used to configure the CORS middleware
 */

// whitelist is an array of strings that contain the origins that are allowed
const whitelist = [
  // "https://www.google.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
  "http://www.yoursite.com",
];

const corsOptions = {
  // the origin property is a function that takes the origin as a parameter
  origin: (origin, callback) => {
    // we probably would need to remove the !origin check in production
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // no error, allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // error, don't allow the request
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers choke on 204
};

module.exports = corsOptions;
