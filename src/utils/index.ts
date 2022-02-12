import reactHotToast from "react-hot-toast";

import * as Data from "data";
import * as ModalsState from "states/ModalsState";

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

export const toast = (message: string, duration: number = 2500) =>
  reactHotToast(message, { duration });

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

export const getKeyStatuses = (solution: string, guesses: string[]) => {
  const correct = guesses.reduce(
    (accumulated, guess) => [
      ...accumulated,
      ...guess
        .split("")
        .filter(
          (letter, index) =>
            !accumulated.includes(letter) && letter === solution[index]
        ),
    ],
    [] as string[]
  );
  const wrongPlace = guesses.reduce(
    (accumulated, guess) => [
      ...accumulated,
      ...guess
        .split("")
        .filter(
          (letter) =>
            !accumulated.includes(letter) &&
            solution.includes(letter) &&
            !correct.includes(letter)
        ),
    ],
    [] as string[]
  );
  const incorrect = guesses.reduce(
    (accumulated, guess) => [
      ...accumulated,
      ...guess
        .split("")
        .filter(
          (letter) =>
            !accumulated.includes(letter) && !solution.includes(letter)
        ),
    ],
    [] as string[]
  );
  return { correct, wrongPlace, incorrect };
};

export const openDelayedStatistics = () => {
  addTimeout(() => {
    ModalsState.accessState().openModal("statistics");
  }, 8000);
};

export const isMobile = () => {
  let isMobileDevice = false;
  if ("maxTouchPoints" in navigator) {
    isMobileDevice = navigator.maxTouchPoints > 0;
  } else {
    var mediaQuery = window.matchMedia?.("(pointer:coarse)");
    if (mediaQuery?.media === "(pointer:coarse)") {
      isMobileDevice = !!mediaQuery.matches;
    } else if ("orientation" in window) {
      isMobileDevice = true;
    } else {
      var userAgent = navigator.userAgent;
      isMobileDevice =
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(userAgent) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(userAgent);
    }
  }
  return isMobileDevice;
};

export const getTotalFlipTime = (wordLength: number) =>
  flipDelay * wordLength + flipTime;

let timeoutIds: number[] = [];
export const addTimeout = (callback: TimerHandler, timeout: number) => {
  const timeoutId = setTimeout(callback, timeout);
  timeoutIds.push(timeoutId);
};

export const cancelTimeouts = () => {
  timeoutIds.forEach((timeout) => clearTimeout(timeout));
  timeoutIds = [];
};
