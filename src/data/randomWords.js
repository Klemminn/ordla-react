// First argument is word length
// Second argument is number of random words
// Third argument is the export filename

const words = require("./words.json");
const fs = require("fs");

const args = process.argv.slice(2);

const wordLength = Number(args[0]);
const randomLength = Number(args[1]);
const fileName = args[2];

const filtered = words.filter((word) => word.length === wordLength);

const random = Array.apply(null, Array(randomLength)).reduce((accumulated) => {
  const getRandom = () => {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
  };
  let randomWord = getRandom();
  while (accumulated.includes(randomWord)) {
    randomWord = getRandom();
  }
  return [...accumulated, randomWord];
}, []);

fs.writeFile(fileName, JSON.stringify(random), (err) => {
  if (err) {
    console.log(err);
    throw err;
  }
});
