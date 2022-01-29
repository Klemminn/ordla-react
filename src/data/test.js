const words = require("./words.json");
const fs = require("fs");

const fiveletter = words.filter((word) => word.length === 5);

fs.writeFile("fiveletter.json", JSON.stringify(fiveletter), (err) => {
  if (err) {
    console.log(err);
    throw err;
    console.log("saved");
  }
});
