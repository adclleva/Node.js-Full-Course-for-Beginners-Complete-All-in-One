const fsPromises = require("fs").promises;

async function createAndDeleteDirectory() {
  try {
    // Check if the directory exists
    try {
      await fsPromises.access("./new");
      console.log("Directory already exists.");
    } catch (error) {
      // Directory does not exist, create it
      await fsPromises.mkdir("./new");
      console.log("Directory created!");
    }

    // At this point, the directory should exist. Remove it.
    await fsPromises.rmdir("./new");
    console.log("Directory removed!");
  } catch (err) {
    console.error("An error occurred:", err);
  }
}

createAndDeleteDirectory();
