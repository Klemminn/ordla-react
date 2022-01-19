import { useState } from "react";
import styled from "styled-components";
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

const NUMBER_OF_ALLOWED_GUESSES = 6;
const DEFAULT_WORD_LENGTH = 5;
const rows = ArrayUtils.createArray(NUMBER_OF_ALLOWED_GUESSES);

const Game: React.FC = () => {
  const [guesses, setGuesses] = useState(rows);
  const [correctKeys, setCorrectKeys] = useState("");
  const [incorrectKeys, setIncorrectKeys] = useState("");
  const [wrongPlaceKeys, setWrongPlaceKeys] = useState("");
  const [guessIndex, setGuessIndex] = useState(0);
  const [wordLength, setWordLength] = useState(DEFAULT_WORD_LENGTH);
  const [word, setWord] = useState("fiska");
  const currentGuess = guesses[guessIndex] ?? "";

  const handleGuessChange = (guess: string) => {
    if (guess.length <= wordLength) {
      const updated = [...guesses];
      updated[guessIndex] = guess;
      setGuesses(updated);
    }
  };

  const handleEnter = () => {
    if (currentGuess.length === wordLength) {
      if (guessIndex < NUMBER_OF_ALLOWED_GUESSES - 1) {
        setGuessIndex(guessIndex + 1);
      } else {
        // Out of guesses
        console.log("hehe");
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
        correctKeys={correctKeys}
        incorrectKeys={incorrectKeys}
        wrongPlaceKeys={wrongPlaceKeys}
      />
    </GameContainer>
  );
};

export default Game;
