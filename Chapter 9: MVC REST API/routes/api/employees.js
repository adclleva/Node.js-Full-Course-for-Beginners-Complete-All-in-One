const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employees");

router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(employeesController.createNewEmployee)
  .put(employeesController.updateEmployee)
  .delete(employeesController.deleteEmployee);

// we are using a named parameter directly from the url
router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
