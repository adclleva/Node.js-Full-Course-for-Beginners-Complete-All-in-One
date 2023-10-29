// const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const fileOps = async () => {
  try {
    // this is one way to read a file
    const data = await fsPromises.readFile(path.join(__dirname, "files", "starter.txt"), "utf8");
    console.log("1. Read Complete:", data);

    // this is a sync function
    // unlink will delete a file
    await fsPromises.unlink(path.join(__dirname, "files", "starter.txt"));

    // writeFile will write a file and if the file does not exist, it will create it
    await fsPromises.writeFile(path.join(__dirname, "files", "promiseWrite.txt"), `Data: ${data}`);

    // appendFile will append to a file and if the file does not exist, it will create it
    await fsPromises.appendFile(path.join(__dirname, "files", "promiseWrite.txt"), "\n\nNice to meet you.");

    // rename will rename a file
    await fsPromises.rename(
      path.join(__dirname, "files", "promiseWrite.txt"),
      path.join(__dirname, "files", "promiseRename.txt")
    );

    const newData = await fsPromises.readFile(path.join(__dirname, "files", "promiseRename.txt"), "utf8");
    console.log("2. Read Complete:", newData);
  } catch (err) {
    console.error(err);
  }
};

fileOps();

// process is a global object
// process.on is an event listener
// uncaughtException is an event that is emitted when an exception is not caught
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
