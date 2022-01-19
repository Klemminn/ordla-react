import { useEffect, useState } from "react";
import styled from "styled-components";
import CardFlip from "react-card-flip";

import { Colors } from "style";
import { TileState } from "types";

import Text from "./Text";

type TileContainerProps = {
  tileState: TileState;
};

const FLIP_TIME = 0.6;

const TileContainer = styled(Text)<TileContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4rem;
  height: 4rem;
  margin: 0.3rem;

  ${({ theme, tileState }) => {
    const backgroundColor =
      tileState === "correct"
        ? Colors.Success
        : tileState === "incorrect"
        ? theme.tone6
        : tileState === "wrongPlace"
        ? Colors.Warning
        : theme.tone7;
    const borderColor = tileState === "default" ? theme.tone4 : backgroundColor;
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
  tileState: TileState;
  index: number;
};

const Tile: React.FC<TileProps> = ({ index, letter, tileState }) => {
  const [delayedTileState, setDelayedTileState] =
    useState<TileState>("default");

  useEffect(() => {
    if (tileState !== undefined && tileState !== "default") {
      setTimeout(() => {
        setDelayedTileState(tileState);
      }, index * FLIP_TIME * 1000);
    }
    // eslint-disable-next-line
  }, [tileState]);

  return (
    <CardFlip
      isFlipped={delayedTileState !== "default"}
      flipDirection="vertical"
      flipSpeedFrontToBack={FLIP_TIME}
      flipSpeedBackToFront={FLIP_TIME}
    >
      <TileContainer tileState={delayedTileState}>{letter}</TileContainer>
      <TileContainer tileState={delayedTileState}>{letter}</TileContainer>
    </CardFlip>
  );
};

export default Tile;
