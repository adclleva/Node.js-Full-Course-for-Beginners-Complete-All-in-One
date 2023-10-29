const fs = require("fs");

// existsSync will check if a directory exists
if (!fs.existsSync("./new")) {
  // mkdir will create a directory
  fs.mkdir("./new", (err) => {
    if (err) throw err;
    console.log("Directory created!");
  });
}

// existsSync will check if a directory exists
if (fs.existsSync("./new")) {
  // rmdir will remove a directory
  fs.rmdir("./new", (err) => {
    if (err) throw err;
    console.log("Directory removed!");
  });
}
