import { useEffect, useState } from "react";
import styled from "styled-components";
import CardFlip from "react-card-flip";

import { Colors } from "style";
import { KeyStatus } from "types";
import { flipTime } from "settings";

import Text from "./Text";

type TileContainerProps = {
  tileStatus: KeyStatus;
  letter?: string;
};

const TileContainer = styled(Text)<TileContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4rem;
  height: 4rem;
  margin: 0.3rem;

  ${({ theme, tileStatus, letter }) => {
    const backgroundColor =
      tileStatus === "correct"
        ? Colors.Success
        : tileStatus === "incorrect"
        ? theme.tone4
        : tileStatus === "wrongPlace"
        ? Colors.Warning
        : theme.tone7;
    const borderColor = letter?.length
      ? theme.tone2
      : tileStatus === "default"
      ? theme.tone4
      : backgroundColor;
    return `
      background-color: ${backgroundColor};
      border: 2px solid ${borderColor};
    `;
  }}
`;
TileContainer.defaultProps = {
  size: 2,
  weight: 700,
};

type TileProps = {
  letter: string;
  tileStatus: KeyStatus;
  index: number;
};

const Tile: React.FC<TileProps> = ({ index, letter, tileStatus }) => {
  const [delayedTileState, setDelayedTileState] =
    useState<KeyStatus>("default");

  useEffect(() => {
    if (tileStatus !== undefined && tileStatus !== "default") {
      setTimeout(() => {
        setDelayedTileState(tileStatus);
      }, index * flipTime ** 2 * 1000);
    } else {
      setDelayedTileState(tileStatus);
    }
    // eslint-disable-next-line
  }, [tileStatus]);

  return (
    <CardFlip
      isFlipped={delayedTileState !== "default"}
      flipDirection="vertical"
      flipSpeedFrontToBack={flipTime}
      flipSpeedBackToFront={flipTime}
    >
      <TileContainer tileStatus={delayedTileState} letter={letter}>
        {letter}
      </TileContainer>
      <TileContainer tileStatus={delayedTileState}>{letter}</TileContainer>
    </CardFlip>
  );
};

export default Tile;
