const express = require("express");

const app = express();

const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

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

// Cross Origin Resource Sharing (CORS) middleware
app.use(cors(corsOptions));

// built-in middleware to handle url encoded data
// in other words, form data
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware to handle json data
// 'content-type: application/json'
app.use(express.json());

// built-in middleware to handle static files
// 'content-type: text/html'
// the / is the default route
// app.use("/", express.static(path.join(__dirname, "public"))); this is the same as the line below
app.use(express.static(path.join(__dirname, "public")));
// this will allow us to serve files from the /subdir route like using the css file in the index.html file
app.use("/subdir", express.static(path.join(__dirname, "public")));

// routes
// these app.use calls here are route handlers
app.use("/", require("./routes/root"));

// this will route all requests to the /subdir route handler
app.use("/subdir", require("./routes/subdir"));

// this is an api route handler example
app.use("/employees", require("./routes/api/employees"));

// these route handlers is similar to how we use middleware

// app.use doesn't accept regular expressions and used mostly for middleware in older versions of express

// app.all is similar to app.use but accepts regular expressions
// app.all is used mostly for route handlers and apply to all HTTP methods
app.all("*", (req, res) => {
  // we explicitly set the 404 status code because we do have a 404.html file
  // and would send a 200 status code otherwise
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "$04 Not found" });
  } else {
    res.type("txt").send("Error: 404 - Not found");
  }
});

// custom error handler middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));