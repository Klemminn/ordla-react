import { useEffect, useState } from "react";
import styled from "styled-components";

import { getRowStates } from "utils";
import { KeyStatus } from "types";

import Tile from "./Tile";

const RowContainer = styled.div`
  display: flex;

  &.shake {
    animation-name: Shake;
    animation-duration: 600ms;
  }

  @keyframes Shake {
    10%,
    90% {
      transform: translateX(-1px);
    }

    20%,
    80% {
      transform: translateX(2px);
    }

    30%,
    50%,
    70% {
      transform: translateX(-4px);
    }

    40%,
    60% {
      transform: translateX(4px);
    }
  }
`;

type TileRowProps = {
  flipped: boolean;
  solution: string;
  letters: string;
  shake: boolean;
};

const TileRow: React.FC<TileRowProps> = ({
  flipped,
  solution,
  letters,
  shake,
}) => {
  const [tileStates, setTileStates] = useState(["default"]);

  useEffect(() => {
    setTileStates(solution.split("").map(() => "default"));
  }, [solution]);

  useEffect(() => {
    if (flipped) {
      const updated = getRowStates(letters, solution);
      setTileStates(updated);
    }
    // eslint-disable-next-line
  }, [flipped]);

  return (
    <RowContainer className={shake ? "shake" : ""}>
      {tileStates.map((state, index) => (
        <Tile
          letter={letters[index] ?? ""}
          key={index}
          tileStatus={state as KeyStatus}
          index={index}
          bounce={solution === letters}
          wordLength={solution.length}
        />
      ))}
    </RowContainer>
  );
};

export default TileRow;
