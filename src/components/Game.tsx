import { useState } from "react";
import styled from "styled-components";
import { UsedKeysStatus } from "types";
import { ArrayUtils } from "utils";

import Header from "./Header";
import Keyboard from "./Keyboard";
import TileRow from "./TileRow";

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

const NUMBER_OF_ALLOWED_GUESSES = 6;
const DEFAULT_WORD_LENGTH = 5;
const rows = ArrayUtils.createArray(NUMBER_OF_ALLOWED_GUESSES);

const Game: React.FC = () => {
  const [guesses, setGuesses] = useState(rows);
  const [usedKeyStatus, setUsedKeyStatus] = useState(defaultUsedKeyStatus);
  const [guessIndex, setGuessIndex] = useState(0);
  const [wordLength, setWordLength] = useState(DEFAULT_WORD_LENGTH);
  const [word, setWord] = useState("fiska");
  const currentGuess = guesses[guessIndex] ?? "";
  const isCorrect = guesses.includes(word);

  const setKeyStates = () => {
    const correct = guesses.reduce(
      (accumulated, guess) => [
        ...accumulated,
        ...guess
          .split("")
          .filter(
            (letter, index) =>
              !accumulated.includes(letter) && letter === word[index]
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
              word.includes(letter) &&
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
            (letter) => !accumulated.includes(letter) && !word.includes(letter)
          ),
      ],
      [] as string[]
    );
    setUsedKeyStatus({ correct, wrongPlace, incorrect });
  };

  const handleGuessChange = (guess: string) => {
    if (!isCorrect && guess.length <= wordLength) {
      const updated = [...guesses];
      updated[guessIndex] = guess;
      setGuesses(updated);
    }
  };

  const updateGuessStatus = () => {
    setGuessIndex(guessIndex + 1);
    setKeyStates();
  };

  const handleEnter = () => {
    if (currentGuess.length === wordLength) {
      if (isCorrect) {
        updateGuessStatus();
      } else if (guessIndex < NUMBER_OF_ALLOWED_GUESSES - 1) {
        updateGuessStatus();
      } else {
        // Out of guesses
        console.log("you lost, you fuck");
      }
    }
  };

  return (
    <GameContainer>
      <Header />
      <GuessContainer>
        {guesses.map((guess, index) => (
          <TileRow
            flipped={guessIndex > index}
            letters={guess}
            word={word}
            key={index}
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
