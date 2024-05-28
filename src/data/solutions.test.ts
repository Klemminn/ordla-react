import solutions5 from "./solutions5.json";
import solutions6 from "./solutions6.json";
import solutions7 from "./solutions7.json";

import words5 from "./words5.json";
import words6 from "./words6.json";
import words7 from "./words7.json";

const wordlistHasSolutions = (wordlist: string[], solutions: string[]) => {
  const missingSolutions = solutions.filter(
    (solution) => !wordlist.includes(solution)
  );
  if (missingSolutions.length) {
    console.log(
      `These solutions are missing in available wordlist - ${wordlist[0].length} letters`,
      missingSolutions
    );
  }
  return missingSolutions.length === 0;
};

const letterLengthMaps = [
  {
    length: 5,
    solutions: solutions5,
    words: words5,
  },
  {
    length: 6,
    solutions: solutions6,
    words: words6,
  },
  {
    length: 7,
    solutions: solutions7,
    words: words7,
  },
];

test("solutions are included in wordlists", () => {
  letterLengthMaps.forEach(({ solutions, words }) => {
    expect(wordlistHasSolutions(words, solutions)).toBeTruthy();
  });
});

const solutionsAreCorrectLength = (solutions: string[], length: number) => {
  const incorrectSolutions = solutions.filter(
    (solution) => solution.length !== length
  );
  if (incorrectSolutions.length) {
    console.log(
      `These solutions are of incorrect length, should be ${length}`,
      incorrectSolutions
    );
  }
  return incorrectSolutions.length === 0;
};

test("solutions are of correct length", () => {
  letterLengthMaps.forEach(({ solutions, length }) => {
    expect(solutionsAreCorrectLength(solutions, length)).toBeTruthy();
  });
});
