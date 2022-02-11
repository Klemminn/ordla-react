import { createState, useState as useHookState, State } from "@hookstate/core";
import { Persistence } from "@hookstate/persistence";
import { mergeDeepLeft } from "ramda";
import { getDaysFromLaunch, getSolution } from "utils";

export type Statistics = {
  currentStreak: number;
  maxStreak: number;
  gamesPlayed: number;
  gamesWon: number;
  numberOfGuesses: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    failed: number;
  };
};

type LengthState = {
  isFinished: boolean;
  correctGuess: number;
  guesses: string[];
  solution: string;
  statistics: Statistics;
};

export type NumberOfGuesses =
  keyof LengthState["statistics"]["numberOfGuesses"];

export type GameState = {
  wordLength: 5 | 6 | 7;
  daysFromLaunch: number;
  5: LengthState;
  6: LengthState;
  7: LengthState;
};

const getDefaultGuesses = () => ["", "", "", "", "", ""];

const getDefaultLengthState = (wordLength: number): LengthState => ({
  isFinished: false,
  correctGuess: -1,
  guesses: getDefaultGuesses(),
  solution: getSolution(wordLength),
  statistics: {
    currentStreak: 0,
    maxStreak: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    numberOfGuesses: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      failed: 0,
    },
  },
});

const getDefaultState = (): GameState => ({
  wordLength: 5,
  daysFromLaunch: 0,
  5: getDefaultLengthState(5),
  6: getDefaultLengthState(6),
  7: getDefaultLengthState(7),
});

const getResetLengthState = (lengthState: LengthState, wordLength: number) => ({
  ...lengthState,
  solution: getSolution(wordLength),
  isFinished: false,
  correctGuess: -1,
  guesses: getDefaultGuesses(),
});

const persistenceStateKey = "gameState";
const fixUpdatedState = () => {
  const current = JSON.parse(localStorage.getItem(persistenceStateKey) ?? "{}");
  const defaultState = getDefaultState();
  const merged = JSON.stringify(mergeDeepLeft(current, defaultState));
  localStorage.setItem(persistenceStateKey, merged);
};
fixUpdatedState();

const gameState = createState<GameState>(getDefaultState());
gameState.attach(Persistence(persistenceStateKey));

const wrapState = (s: State<GameState>) => ({
  getGameState: () => s.value[s.value.wordLength],
  getWordLength: () => s.value.wordLength,
  getDaysFromLaunch: () => s.value.daysFromLaunch,
  getIsFinished: (length: GameState["wordLength"]) =>
    s.value[length].isFinished,

  setWordLength: s.wordLength.set,
  resetGame: () => {
    const daysFromLaunch = getDaysFromLaunch();
    const clone = JSON.parse(JSON.stringify(s.value));
    clone.daysFromLaunch = daysFromLaunch;
    clone["5"] = getResetLengthState(clone["5"], 5);
    clone["6"] = getResetLengthState(clone["6"], 6);
    clone["7"] = getResetLengthState(clone["7"], 7);
    s.set(clone);
  },
  addGuess: (guess: string) =>
    s.merge((current) => {
      const wordLength = s.value.wordLength;
      const guesses = JSON.parse(
        JSON.stringify(current[wordLength].guesses)
      ) as string[];
      const nextIndex = guesses.findIndex((guess) => !guess.length);
      guesses[nextIndex] = guess;

      return {
        [wordLength]: { ...current[wordLength], guesses },
      };
    }),
  updateStatistics: (
    numberOfGuesses: keyof LengthState["statistics"]["numberOfGuesses"]
  ) =>
    s.merge((current) => {
      const statistics = JSON.parse(
        JSON.stringify(s.value[s.value.wordLength].statistics)
      );
      if (numberOfGuesses !== "failed") {
        statistics.currentStreak += 1;
        statistics.gamesWon += 1;
        statistics.maxStreak =
          statistics.currentStreak > statistics.maxStreak
            ? statistics.currentStreak
            : statistics.maxStreak;
      } else {
        statistics.currentStreak = 0;
      }
      statistics.numberOfGuesses[numberOfGuesses] += 1;
      statistics.gamesPlayed += 1;

      return {
        [s.value.wordLength]: {
          ...current[s.value.wordLength],
          isFinished: true,
          correctGuess: numberOfGuesses !== "failed" ? numberOfGuesses : -1,
          statistics,
        },
      };
    }),
});

export const accessState = () => wrapState(gameState);
export const useState = () => wrapState(useHookState(gameState));
