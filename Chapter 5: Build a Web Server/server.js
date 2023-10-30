// these are common core modules
const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");

const logEvents = require("./logEvents");
const Emitter = require("events");

class MyEmitter extends Emitter {}

// initialize an instance of MyEmitter
const myEmitter = new MyEmitter();

myEmitter.on("log", (msg, fileName) => logEvents(msg, fileName));

// this defines the server port
const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      // this is to prevent the server from crashing when trying to read an image file
      !contentType.includes("image") ? "utf8" : ""
    );

    // this will show the data as JSON if the content type is application/json
    const data = contentType === "application/json" ? JSON.parse(rawData) : rawData;
    response.writeHead(filePath.includes("404.html") ? 404 : 200, { "Content-Type": contentType });

    response.end(contentType === "application/json" ? JSON.stringify(data) : data);
  } catch (error) {
    console.log(error);
    myEmitter.emit("log", `${error.name}: ${error.message}`, `errorLog.txt`);

    response.statusCode = 500;
    response.end();
  }
};

const server = http.createServer((req, res) => {
  console.log({ url: req.url, method: req.method });
  myEmitter.emit("log", `${req.method} ${req.url}`, `reqLog.txt`);

  const extension = path.extname(req.url);

  let contentType;

  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
  }

  let filePath;

  if (contentType === "text/html" && req.url === "/") {
    filePath = path.join(__dirname, "views", "index.html");
  } else if (contentType === "text/html" && req.url.slice(-1) === "/") {
    filePath = path.join(__dirname, "views", req.url, "index.html");
  } else if (contentType === "text/html") {
    filePath = path.join(__dirname, "views", req.url);
  } else {
    filePath = path.join(__dirname, req.url);
  }

  // makes the .html extension optional in the browser
  if (!extension && req.url.slice(-1) !== "/") {
    filePath += ".html";
  }

  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    // serve the file
    serveFile(filePath, contentType, res);
  } else {
    // this could be a 404 error
    // this could be a 301 redirect

    // we parse the file path because we want to know the directory name
    console.log(path.parse(filePath));
    switch (path.parse(filePath).base) {
      case `old-page.html`:
        res.writeHead(301, { Location: "/new-page.html" });
        res.end();
        break;
      case `www-page.html`:
        res.writeHead(301, { Location: "/" });
        res.end();
        break;

      default:
        // we serve a 404 response
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
