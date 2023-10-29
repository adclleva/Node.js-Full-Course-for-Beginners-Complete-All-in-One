const fs = require("fs");
const path = require("path");
// utf8 is the default encoding
// thi is an async function

// this is one way to read a file
// fs.readFile("./files/starter.txt", "utf8", (err, data) => {

// we can also use path.join to join the path because there are different ways to write the path
// especially if we are working with different operating systems
fs.readFile(path.join(__dirname, "files", "starter.txt"), "utf8", (err, data) => {
  if (err) throw err;
  console.log("1. Read Complete:", data);
});

console.log("2. Hello World!");

// this is a callback hell example
// ths utf8 is the default encoding
// this is a sync function
// writeFile will write a file and if the file does not exist, it will create it
fs.writeFile(path.join(__dirname, "files", "reply.txt"), "Nice to meet you", (err, data) => {
  if (err) throw err;
  console.log("3. Write Complete!");

  // this is an async function
  // since this is inside the callback of writeFile, it will only run after writeFile is done
  // appendFile will append to a file and if the file does not exist, it will create it
  fs.appendFile(path.join(__dirname, "files", "reply.txt"), "\n\nLikewise!", (err, data) => {
    if (err) throw err;
    console.log("4. Append 1 Complete!");

    fs.rename(
      path.join(__dirname, "files", "reply.txt"),
      path.join(__dirname, "files", "newReply.txt"),
      (err, data) => {
        if (err) throw err;
        console.log("5. Rename Complete!");
      }
    );
  });
});

// this is an async function
// appendFile will append to a file and if the file does not exist, it will create it
fs.appendFile(path.join(__dirname, "files", "test.txt"), "Testing text \n", (err, data) => {
  if (err) throw err;
  console.log("6. Append 2 Complete!");
});

// process is a global object
// process.on is an event listener
// uncaughtException is an event that is emitted when an exception is not caught
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
