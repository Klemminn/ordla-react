// First argument is word length, next is export filename

const words = require("./words.json");
const fs = require("fs");

const args = process.argv.slice(2);

const wordLength = Number(args[0]);
const fileName = args[1];

const filtered = words.filter((word) => word.length === wordLength);

fs.writeFile(fileName, JSON.stringify(filtered), (err) => {
  if (err) {
    console.log(err);
    throw err;
  }
});
