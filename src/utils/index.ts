import reactHotToast from "react-hot-toast";

export const createArray = (length: number) =>
  Array(length).join(".").split(".");

const LAUNCH_MILLISECONDS = 1644451200000;

export const getDaysFromLaunch = () => {
  const currentDate = new Date();
  const millisecondsFromLaunch = currentDate.valueOf() - LAUNCH_MILLISECONDS;
  const wholeDaysFromLaunch = Math.floor(
    millisecondsFromLaunch / (1000 * 60 * 60 * 24)
  );
  return wholeDaysFromLaunch;
};

export const getPercentage = (part: number, total: number) =>
  total === 0 ? 0 : Math.ceil((part * 100) / total);

export const toast = (message: string) =>
  reactHotToast(message, { duration: 2500 });

export const getRowStates = (row: string, solution: string) => {
  let parsedWord = solution;
  return row
    .split("")
    .map((letter, index) => {
      if (letter === parsedWord[index]) {
        parsedWord = parsedWord.replace(letter, " ");
        return "correct";
      }
      return "incorrect";
    })
    .map((state, index) => {
      if (state === "correct") {
        return state;
      }
      const letter = row[index];
      const indexInWord = parsedWord.indexOf(letter);
      if (indexInWord > -1) {
        parsedWord = parsedWord.replace(letter, " ");
        return "wrongPlace";
      }
      return "incorrect";
    });
};

export const getSolution = async (wordLength: number) => {
  const daysFromLaunch = getDaysFromLaunch();
  const solutions = await require(`data/${wordLength}solutions`);
  return solutions[daysFromLaunch % solutions.length];
};
