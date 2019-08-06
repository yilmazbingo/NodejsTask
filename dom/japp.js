const fs = require("fs");
const readMe = fs.readFileSync("../../readme.txt", "utf-8");
console.log(readMe);
