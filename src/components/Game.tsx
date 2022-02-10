import { useEffect, useRef, useState } from "react";
import { flipTime } from "const";
import styled from "styled-components";

import { UsedKeysStatus } from "types";
import { getDaysFromLaunch, toast } from "utils";
import { GameState } from "states";

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
    const solutions = await require(`data/${length}solutions`);
    const daysFromLaunch = getDaysFromLaunch();
    solution.current = solutions[daysFromLaunch];
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

  const handleEnter = () => {
    if (!isFinished) {
      if (currentGuess.length === wordLength) {
        if (allowedWords.current.includes(currentGuess)) {
          if (currentGuess === solution.current) {
            runAfterFlip(() => toast(congratulationStrings[guessIndex]));
            gameState.updateStatistics(
              (guessIndex + 1) as GameState.NumberOfGuesses
            );
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
