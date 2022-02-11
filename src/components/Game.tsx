import { useEffect, useState } from "react";
import styled from "styled-components";

import { UsedKeysStatus } from "types";
import {
  addTimeout,
  cancelTimeouts,
  getAllowedWords,
  getDaysFromLaunch,
  getKeyStatuses,
  getRowStates,
  getTotalFlipTime,
  openDelayedStatistics,
  toast,
} from "utils";
import { GameState, SettingsState } from "states";

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
  correct: [],
  wrongPlace: [],
  incorrect: [],
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
  const wordLength = solution.length;
  const allowedWords = getAllowedWords(wordLength);
  const stateDaysFromLaunch = gameState.getDaysFromLaunch();
  const [usedKeyStatus, setUsedKeyStatus] = useState(defaultUsedKeyStatus);
  const firstEmptyGuess = guesses.findIndex((guess) => !guess.length);
  const guessIndex = firstEmptyGuess > -1 ? firstEmptyGuess : guesses.length;
  const [shake, setShake] = useState(false);
  const [currentGuess, setCurrentGuess] = useState(guesses[guessIndex]);

  useEffect(() => {
    const daysFromLaunch = getDaysFromLaunch();
    if (daysFromLaunch !== stateDaysFromLaunch) {
      gameState.resetGame();
    }
    setCurrentGuess("");
    setKeyStatuses();
    cancelTimeouts();
    // eslint-disable-next-line
  }, [wordLength]);

  const setKeyStatuses = () => {
    const keyStatuses = getKeyStatuses(solution, guesses);
    setUsedKeyStatus(keyStatuses);
  };

  const handleGuessChange = (guess: string) => {
    if (!isFinished && guess.length <= wordLength) {
      setCurrentGuess(guess);
    }
  };

  const runAfterFlip = (callback: Function) => {
    addTimeout(() => {
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
            openDelayedStatistics();
          } else if (guessIndex === guesses.length - 1) {
            runAfterFlip(() => {
              toast(solution.toUpperCase(), 4000);
              openDelayedStatistics();
            });
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
