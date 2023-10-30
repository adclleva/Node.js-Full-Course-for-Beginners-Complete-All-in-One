const fs = require("fs");

const rs = fs.createReadStream("./files/lorem.txt", { encoding: "utf8" });

const ws = fs.createWriteStream("./files/new-lorem.txt");

// data is an event that is emitted when a chunk of data is available
// ts.on is an event listener
/*
rs.on("data", (dataChunk) => {
  console.log("Data Chunk:", dataChunk);
  ws.write(dataChunk);
});
*/

// pipe is a method that is used to read and write data
// this is more effecient than the above code
rs.pipe(ws);
