const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employees");
// const verifyJWT = require("../../middleware/verifyJWT");

router
  .route("/")
  /**
   * verifyJWT is a middleware that we created to check if the user is authenticated
   * before we allow them to access the route handler below
   * this is how we use middleware in a route handler
   * the easier way to do this is to add verifyJWT as a second argument to the route handler
   */
  // .get(verifyJWT, employeesController.getAllEmployees)
  .get(employeesController.getAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee)
  .delete(employeesController.deleteEmployee);

// we are using a named parameter directly from the url
router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
