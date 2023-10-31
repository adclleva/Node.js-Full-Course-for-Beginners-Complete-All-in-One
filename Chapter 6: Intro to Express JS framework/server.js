const express = require("express");

const app = express();

const path = require("path");
const PORT = process.env.PORT || 3500;

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

app.get("/*", (req, res) => {
  // we explicitly set the 404 status code because we do have a 404.html file
  // and would send a 200 status code otherwise
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
