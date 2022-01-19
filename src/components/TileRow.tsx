import { useEffect, useState } from "react";
import styled from "styled-components";

import { ArrayUtils } from "utils";
import { TileState } from "types";

import Tile from "./Tile";

const RowContainer = styled.div`
  display: flex;
`;

type TileRowProps = {
  flipped: boolean;
  word: string;
  letters: string;
};

const TileRow: React.FC<TileRowProps> = ({ flipped, word, letters }) => {
  const [tileStates, setTileStates] = useState(
    ArrayUtils.createArray(word.length).map(() => "default")
  );

  useEffect(() => {
    if (flipped) {
      let parsedWord = word.toUpperCase();
      const updated = letters
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
          const letter = letters[index];
          const indexInWord = parsedWord.indexOf(letter);
          if (indexInWord > -1) {
            parsedWord = parsedWord.replace(letter, " ");
            return "wrongPlace";
          }
          return "incorrect";
        });
      setTileStates(updated);
    }
    // eslint-disable-next-line
  }, [flipped]);

  return (
    <RowContainer>
      {tileStates.map((state, index) => (
        <Tile
          letter={letters[index] ?? ""}
          key={index}
          tileState={state as TileState}
          index={index}
        />
      ))}
    </RowContainer>
  );
};

export default TileRow;
