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
app.use(express.static(path.join(__dirname, "public")));

/**
 * express automatically handles the correct status code  and content type
 * express handles these routes in the order they are defined
 */

// express supports regular expressions
/* Here is the explanation for the code above:
    1. ^/$: matches the home page
    2. |: OR
    3. /index: matches the index page
    4. (.html)?: matches the .html suffix, which is optional
 */
app.get("^/$|/index(.html)?", (req, res) => {
  // this is sending Hello World! as plain text
  //   res.send("Hello World!");

  // sendFile is sending the index.html file
  // this is one way to send a file
  //  res.sendFile("./views/index.html", { root: __dirname });

  // this is another way to send a file
  // __dirname is the current directory
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
  // res.redirect('/new-page.html'); // => this gets a 302 by default but we want a 301
  res.redirect(301, "/new-page.html"); // thus we specify the status code
});

// Route handlers can take multiple callback functions and was can chain them together
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attempted to load hello.html");

    // next is a function that tells express to move on to the next route handler
    next();

    // if this is the last route handler, we don't need the next parameter
  },
  (req, res) => {
    res.send("Hello World!");
  }
);

// an example of chaining route handlers
const one = (req, res, next) => {
  console.log("one");
  next();
};

const two = (req, res, next) => {
  console.log("two");
  next();
};

const three = (req, res) => {
  console.log("three");
  res.send("Finished!");
};

// this is how we chain route handlers
app.get("/chain(.html)?", [one, two, three]);

// these route handlers is similar to how we use middleware

// app.use doesn't accept regular expressions and used mostly for middleware

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
