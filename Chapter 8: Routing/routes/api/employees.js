const express = require("express");
const router = express.Router();
const data = {};

// this is like connecting to a database
data.employees = require("../../data/employees.json");

router
  .route("/")
  .get((req, res) => {
    // get is retrieving the resource
    // res.json is sending json data to the client
    res.json(data.employees);
  })
  .post((req, res) => {
    // post is creating a new resource
    res.json({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
  })
  .put((req, res) => {
    // put is updating the entire resource
    res.json({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
  })
  .delete((req, res) => {
    // delete is deleting the entire resource
    res.json({
      id: req.body.id,
    });
  });

// we are using a named parameter directly from the url
router.route("/:id").get((req, res) => {
  res.json({ id: req.params.id });
});

module.exports = router;
