const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    await fsPromises.appendFile(path.join(__dirname, "..", "logs", logFileName), logItem);
  } catch (err) {
    console.log(err);
  }
};

// this is our custom middleware logger that we can export
const logger = (req, res, next) => {
  // req.headers.origin is where the request is coming from
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "requestLog.txt");
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logger, logEvents };
