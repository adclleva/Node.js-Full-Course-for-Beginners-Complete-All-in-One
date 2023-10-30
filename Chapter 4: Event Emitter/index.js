const { log } = require("console");
const logEvents = require("./logEvents");

const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

// initialize an instance of MyEmitter
const myEmitter = new MyEmitter();

// add listener for the "log" event
myEmitter.on("log", (msg, msg2) => logEvents(msg, msg2));

// we set a delay of 1 second to simulate a long-running process
setTimeout(() => {
  // emit the "log" event
  myEmitter.emit("log", "Log event emitted!", "For the second parameter!");
}, 2000);
