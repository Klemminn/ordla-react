import { useEffect, useRef, useState } from "react";
import { flipTime } from "const";
import styled from "styled-components";

import { UsedKeysStatus } from "types";
import {
  getAllowedWords,
  getDaysFromLaunch,
  getRowStates,
  getTotalFlipTime,
  toast,
} from "utils";
import { GameState, ModalsState, SettingsState } from "states";

import Header from "./Header";
import Keyboard from "./Keyboard";
import TileRow from "./TileRow";
import LengthSelector from "./LengthSelector";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  max-width: 500px;
`;

const GuessContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const defaultUsedKeyStatus: UsedKeysStatus = {
  correct: [] as string[],
  wrongPlace: [] as string[],
  incorrect: [] as string[],
};

const congratulationStrings = [
  "Snillingur!",
  "Framúrskarandi!",
  "Frábært!",
  "Vel gert!",
  "Engin pressa!",
  "Hjúkket!",
];

const Game: React.FC = () => {
  const { isHardMode } = SettingsState.useState().get();
  const gameState = GameState.useState();
  const currentGame = gameState.getGameState();
  const { guesses, solution, isFinished } = currentGame;
  const wordLength = gameState.getWordLength();
  const stateDaysFromLaunch = gameState.getDaysFromLaunch();
  const allowedWords = getAllowedWords(wordLength);
  const [usedKeyStatus, setUsedKeyStatus] = useState(defaultUsedKeyStatus);
  const firstEmptyGuess = guesses.findIndex((guess) => !guess.length);
  const guessIndex =
    firstEmptyGuess > -1 ? firstEmptyGuess : guesses.length + 1;
  const [shake, setShake] = useState(false);
  const [currentGuess, setCurrentGuess] = useState(guesses[guessIndex]);
  const afterFlipTimeoutRef = useRef<null | ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const daysFromLaunch = getDaysFromLaunch();
    if (daysFromLaunch !== stateDaysFromLaunch) {
      gameState.resetGame();
    }
    setCurrentGuess("");
    setKeyStatuses();
    if (afterFlipTimeoutRef.current) {
      clearTimeout(afterFlipTimeoutRef.current);
    }
    // eslint-disable-next-line
  }, [wordLength]);

  const setKeyStatuses = () => {
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
    setUsedKeyStatus({ correct, wrongPlace, incorrect });
  };

  const handleGuessChange = (guess: string) => {
    if (!isFinished && guess.length <= wordLength) {
      setCurrentGuess(guess);
    }
  };

  const runAfterFlip = (callback: Function) => {
    afterFlipTimeoutRef.current = setTimeout(() => {
      callback();
    }, getTotalFlipTime(wordLength));
  };

  const handleFailure = (message: string) => {
    toast(message);
    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 600);
  };

  const isHardModeValid = () => {
    if (isHardMode && guessIndex > 0) {
      const previousGuess = guesses[guessIndex - 1];
      const previousGuessStates = getRowStates(previousGuess, solution);
      const missingCorrect = previousGuessStates.findIndex(
        (state, index) =>
          state === "correct" && currentGuess[index] !== previousGuess[index]
      );
      if (missingCorrect > -1) {
        toast(
          `${previousGuess[
            missingCorrect
          ].toUpperCase()} var á réttum stað áðan!`
        );
        return false;
      }
      const missingWrongPlace = previousGuessStates.findIndex(
        (state, index) => {
          if (state !== "wrongPlace") {
            return false;
          }
          const previousLetter = previousGuess[index];
          return !currentGuess
            .split("")
            .find(
              (currentLetter, index) =>
                currentLetter === previousLetter &&
                previousGuessStates[index] !== "correct"
            );
        }
      );
      if (missingWrongPlace > -1) {
        toast(
          `Þú verður að nota ${previousGuess[missingWrongPlace].toUpperCase()}`
        );
        return false;
      }
    }
    return true;
  };

  const handleEnter = () => {
    if (!isFinished) {
      if (currentGuess.length === wordLength) {
        if (!isHardModeValid()) {
          return;
        }
        if (allowedWords.includes(currentGuess)) {
          if (currentGuess === solution) {
            runAfterFlip(() => toast(congratulationStrings[guessIndex]));
            gameState.updateStatistics(
              (guessIndex + 1) as GameState.NumberOfGuesses
            );
            setTimeout(() => {
              ModalsState.accessState().openModal("statistics");
            }, 5000);
          } else if (guessIndex === guesses.length - 1) {
            toast(solution.toUpperCase());
            gameState.updateStatistics("failed");
          }
          const updated = [...guesses];
          updated[guessIndex] = currentGuess;
          gameState.addGuess(currentGuess);
          setCurrentGuess("");
          runAfterFlip(setKeyStatuses);
        } else {
          handleFailure(
            `${currentGuess.toUpperCase()} er ekki í orðaforðanum okkar`
          );
        }
      } else {
        handleFailure("Ekki nægilega margir stafir");
      }
    }
  };

  return (
    <GameContainer>
      <Header />
      <LengthSelector />
      <GuessContainer>
        {guesses.map((guess, index) => (
          <TileRow
            flipped={guessIndex > index}
            letters={index === guessIndex ? currentGuess : guess}
            solution={solution}
            shake={guessIndex === index && shake}
            key={`${wordLength}-${index}`}
          />
        ))}
      </GuessContainer>
      <Keyboard
        onChange={handleGuessChange}
        onEnter={handleEnter}
        value={currentGuess}
        usedKeyStatus={usedKeyStatus}
      />
    </GameContainer>
  );
};

export default Game;
