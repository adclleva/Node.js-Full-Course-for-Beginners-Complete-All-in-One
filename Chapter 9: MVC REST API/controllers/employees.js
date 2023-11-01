// we separated the logic from the routes api and put it in the controllers
// since controllers are what usually handles the logic of the application
// for the MVC pattern, we are separating the logic from the routes

// const data = {};
// this is like connecting to a database
// data.employees = require("../model/data/employees.json");

const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (employees) {
    this.employees = employees;
  },
};

const getAllEmployees = (req, res) => {
  // get is retrieving the resource
  // res.json is sending json data to the client
  res.json(data.employees);
};

const getEmployee = (req, res) => {
  // this grabs the first employee that matches the id
  const employee = data.employees.find((employee) => employee.id === parseInt(req.params.id));

  if (!employee) {
    // a 404 status code means that the resource was not found
    return res.status(404).json({ message: `Employee ID ${req.params.id} does not exist!` });
  }

  res.json(employee);
};

const createNewEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees?.length > 0 ? data.employees[data.employees.length - 1].id + 1 : 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  if (!newEmployee.firstName || !newEmployee.lastName) {
    return res.status(400).json({ message: "First and last names are required!" });
  }

  data.setEmployees([...data.employees, newEmployee]);
  // a 201 status code means that a new resource was created
  res.status(201).json(newEmployee);
};

const updateEmployee = (req, res) => {
  // this grabs the first employee that matches the id
  const updatedEmployee = data.employees.find((employee) => employee.id === parseInt(req.body.id));

  if (!updatedEmployee) {
    return res.status(400).json({ message: `Employee ID ${req.body.id} does not exist!` });
  }

  if (req.body.firstName) {
    updatedEmployee.firstName = req.body.firstName;
  }

  if (req.body.lastName) {
    updatedEmployee.lastName = req.body.lastName;
  }

  data.setEmployees(
    data.employees.map((employee) => (employee.id === parseInt(req.body.id) ? updatedEmployee : employee))
  );

  res.status(200).json(data.employees);
};

const deleteEmployee = (req, res) => {
  const deletedEmployee = data.employees.find((employee) => employee.id === parseInt(req.body.id));

  if (!deletedEmployee) {
    return res.status(400).json({ message: `Employee ID ${req.body.id} does not exit!` });
  }

  const filteredArray = data.employees.filter((employee) => employee.id !== parseInt(req.body.id));

  data.setEmployees([...filteredArray]);

  res.status(200).json(data.employees);
};

module.exports = {
  getAllEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
};
