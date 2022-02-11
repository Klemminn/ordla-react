import reactHotToast from "react-hot-toast";
import * as Data from "data";
import { flipDelay, flipTime } from "const";

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

export const getAllowedWords = (wordLength: number) => {
  const words = Data[`words${wordLength}` as keyof typeof Data];
  return words;
};

export const getSolution = (wordLength: number) => {
  const daysFromLaunch = getDaysFromLaunch();
  const solutions = Data[`solutions${wordLength}` as keyof typeof Data];
  return solutions[daysFromLaunch % solutions.length] ?? solutions[0];
};

export const isMobile = () => {
  let checker = false;
  if ("maxTouchPoints" in navigator) {
    checker = navigator.maxTouchPoints > 0;
  } else if ("msMaxTouchPoints" in navigator) {
    checker = navigator.maxTouchPoints > 0;
  } else {
    var mQ = window.matchMedia?.("(pointer:coarse)");
    if (mQ && mQ.media === "(pointer:coarse)") {
      checker = !!mQ.matches;
    } else if ("orientation" in window) {
      checker = true;
    } else {
      var UA = navigator.userAgent;
      checker =
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
    }
  }
  return checker;
};

export const getTotalFlipTime = (wordLength: number) =>
  flipDelay * wordLength + flipTime;
