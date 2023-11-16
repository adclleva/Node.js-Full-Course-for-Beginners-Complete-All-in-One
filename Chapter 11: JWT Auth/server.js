const express = require("express");

const app = express();

const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing (CORS) middleware
app.use(cors(corsOptions));

// built-in middleware to handle url encoded data
// in other words, form data
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// middleware to handle cookies
app.use(cookieParser());

// built-in middleware to handle json data
// 'content-type: application/json'
app.use(express.json());

// built-in middleware to handle static files
// 'content-type: text/html'
// the / is the default route
// app.use("/", express.static(path.join(__dirname, "public"))); this is the same as the line below
app.use(express.static(path.join(__dirname, "public")));

// routes
// these app.use calls here are route handlers
app.use("/", require("./routes/root"));

app.use("/register", require("./routes/register"));

app.use("/auth", require("./routes/auth"));

app.use("/refresh", require("./routes/refresh"));

app.use("/logout", require("./routes/logout"));

// anything below this line will require authentication
// anything above this line will not require authentication
// since this file runs from top to bottom
// this verifies the jwt access token
app.use(verifyJWT);

// this is an api route handler example
app.use("/employees", require("./routes/api/employees"));

// these route handlers is similar to how we use middleware

// app.use doesn't accept regular expressions and used mostly for middleware in older versions of express

// app.all is similar to app.use but accepts regular expressions
// app.all is used mostly for route handlers and apply to all HTTP methods

// this is our catch-all route handler for 404 errors
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
