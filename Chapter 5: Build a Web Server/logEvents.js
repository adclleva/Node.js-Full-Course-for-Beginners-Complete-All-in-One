// these are npm packages
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

// these are common core modules
const fs = require("fs");
const fsPromises = require("fs/promises"); // this is a newer way to require modules
const path = require("path");

const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);

  try {
    // this will check if the logs directory exists and create it if it doesn't
    if (!fs.existsSync(path.join(__dirname, "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "logs"));
    }

    // appendFile creates the file if it doesn't exist
    await fsPromises.appendFile(path.join(__dirname, "logs", logFileName), logItem);
  } catch (error) {
    console.error(error);
  }
};

module.exports = logEvents;

// console.log(format(new Date(), "yyyyMMdd\tHH:mm:ss"));

// console.log("Hello World!");

// console.log(uuid());
