import { useEffect, useState } from "react";
import styled from "styled-components";
import CardFlip from "react-card-flip";

import { Colors } from "style";
import { KeyStatus } from "types";
import { flipTime, flipDelay } from "const";

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
        ? theme.tone3
        : tileStatus === "wrongPlace"
        ? Colors.Warning
        : theme.tone7;
    const borderColor = letter?.length
      ? theme.tone2
      : tileStatus === "default"
      ? theme.tone4
      : backgroundColor;
    const fontColor = tileStatus !== "default" ? "white" : theme.tone1;
    return `
      color: ${fontColor};
      background-color: ${backgroundColor};
      border: 2px solid ${borderColor};
    `;
  }}

  &.bounce {
    animation-name: Bounce;
    animation-duration: 600ms;
  }

  @keyframes Bounce {
    0%,
    20% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-30px);
    }
    50% {
      transform: translateY(5px);
    }
    60% {
      transform: translateY(-15px);
    }
    80% {
      transform: translateY(2px);
    }
    100% {
      transform: translateY(0);
    }
  }
`;
TileContainer.defaultProps = {
  size: 2,
  weight: 700,
};

type TileProps = {
  letter: string;
  tileStatus: KeyStatus;
  index: number;
  bounce: boolean;
  wordLength: number;
};

const Tile: React.FC<TileProps> = ({
  index,
  letter,
  tileStatus,
  bounce,
  wordLength,
}) => {
  const [delayedTileState, setDelayedTileState] =
    useState<KeyStatus>("default");
  const [delayedBounce, setDelayedBounce] = useState(false);

  useEffect(() => {
    if (tileStatus !== undefined && tileStatus !== "default") {
      setTimeout(() => {
        setDelayedTileState(tileStatus);
        setTimeout(() => {
          setDelayedBounce(bounce);
        }, wordLength * flipDelay);
      }, index * flipDelay);
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
      <TileContainer
        className={delayedBounce ? "bounce" : ""}
        tileStatus={delayedTileState}
      >
        {letter}
      </TileContainer>
    </CardFlip>
  );
};

export default Tile;
