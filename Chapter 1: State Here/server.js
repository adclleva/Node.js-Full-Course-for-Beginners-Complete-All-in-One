// How NodeJS differs from Vanilla JS
// 1. Node runes on a server - not in a browser (backend not frontend)
// 2. the console is the terminal window
console.log("Hello World!");

// 3. global object instead of window object
console.log(global);
// 4. Has Common Core Modules
// 5. CommonJS Modules instead of ES6 Modules
// 6. Missing some JS APIs like fetch, DOM, localstorage

// this is a core module
// explain this

const os = require("os");
const path = require("path");

const { add, subtract, multiply, divide } = require("./math");

console.log(add(1, 2));
console.log(subtract(1, 2));
console.log(multiply(1, 2));
console.log(divide(1, 2));

console.log(os.type());
console.log(os.version());
console.log(os.homedir());

console.log(__dirname);
console.log(__filename);

console.log(path.dirname(__filename));
console.log(path.basename(__filename));
console.log(path.extname(__filename));

console.log(path.parse(__filename));
