const express = require("express");
const router = express.Router();
const path = require("path");

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
router.get("^/$|/index(.html)?", (req, res) => {
  // this is sending Hello World! as plain text
  //   res.send("Hello World!");

  // sendFile is sending the index.html file
  // this is one way to send a file
  //  res.sendFile("./views/index.html", { root: __dirname });

  // this is another way to send a file
  // __dirname is the current directory
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});

router.get("/old-page(.html)?", (req, res) => {
  // res.redirect('/new-page.html'); // => this gets a 302 by default but we want a 301
  res.redirect(301, "/new-page.html"); // thus we specify the status code
});

module.exports = router;
