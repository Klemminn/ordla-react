import { useEffect, useRef, useState } from "react";
import { flipTime } from "const";
import styled from "styled-components";

import { UsedKeysStatus } from "types";
import { getDaysFromLaunch, getRowStates, getSolution, toast } from "utils";
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
  const guesses = currentGame.guesses;
  const isFinished = currentGame.isFinished;
  const wordLength = gameState.getWordLength();
  const stateDaysFromLaunch = gameState.getDaysFromLaunch();
  const solution = useRef("");
  const allowedWords = useRef<string[]>([]);
  const [usedKeyStatus, setUsedKeyStatus] = useState(defaultUsedKeyStatus);
  const [guessIndex, setGuessIndex] = useState(0);
  const [shake, setShake] = useState(false);
  const currentGuess = guesses[guessIndex];

  useEffect(() => {
    handleWordLengthChange(wordLength);
    // eslint-disable-next-line
  }, [wordLength]);

  const handleWordLengthChange = async (length: number) => {
    allowedWords.current = await require(`data/${length}letter`);
    solution.current = await getSolution(wordLength);
    const daysFromLaunch = getDaysFromLaunch();
    if (daysFromLaunch !== stateDaysFromLaunch) {
      gameState.resetGame();
    }
    const index = guesses.findIndex(
      (guess) => !allowedWords.current.includes(guess)
    );
    setGuessIndex(index >= 0 ? index : guesses.length);
    setKeyStatuses();
  };

  const setKeyStatuses = () => {
    const correct = guesses.reduce(
      (accumulated, guess) => [
        ...accumulated,
        ...guess
          .split("")
          .filter(
            (letter, index) =>
              !accumulated.includes(letter) &&
              letter === solution.current[index]
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
              solution.current.includes(letter) &&
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
              !accumulated.includes(letter) &&
              !solution.current.includes(letter)
          ),
      ],
      [] as string[]
    );
    setUsedKeyStatus({ correct, wrongPlace, incorrect });
  };

  const handleGuessChange = (guess: string) => {
    if (!isFinished && guess.length <= wordLength) {
      const updated = [...guesses];
      updated[guessIndex] = guess;
      gameState.setGuesses(updated);
    }
  };

  const runAfterFlip = (callback: Function) => {
    setTimeout(() => {
      callback();
    }, flipTime * 1000 * (wordLength - 1));
  };

  const updateGuessStatus = () => {
    setGuessIndex(guessIndex + 1);
    runAfterFlip(setKeyStatuses);
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
      const previousGuessStates = getRowStates(previousGuess, solution.current);
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
        if (allowedWords.current.includes(currentGuess)) {
          if (currentGuess === solution.current) {
            runAfterFlip(() => toast(congratulationStrings[guessIndex]));
            gameState.updateStatistics(
              (guessIndex + 1) as GameState.NumberOfGuesses
            );
            setTimeout(() => {
              ModalsState.accessState().openModal("statistics");
            }, 5000);
          } else if (guessIndex === guesses.length - 1) {
            toast(solution.current.toUpperCase());
            gameState.updateStatistics("failed");
          }
          updateGuessStatus();
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
            letters={guess}
            solution={solution.current}
            shake={guessIndex === index && shake}
            key={`${solution.current}${index}`}
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
