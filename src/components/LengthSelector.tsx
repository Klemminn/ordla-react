import { GameState } from "states";
import { Colors } from "style";
import styled from "styled-components";
import Text from "./Text";

const allowedLengths = [5, 6, 7];

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 1rem;
`;

type ButtonProps = {
  gameLengthState: "win" | "lost" | "default";
  selected: boolean;
};

const Button = styled.button<ButtonProps>`
  flex: 1;
  margin: 0 0.5rem;
  height: 4rem;
  border: none;
  border-radius: 0.5rem;
  background-color: ${({ gameLengthState, selected, theme }) =>
    gameLengthState === "win"
      ? Colors.Success
      : gameLengthState === "lost"
      ? Colors.Fail
      : selected
      ? theme.tone2
      : theme.tone5};
`;

const LengthSelector: React.FC = () => {
  const gameState = GameState.useState();
  const currentWordLength = gameState.getWordLength();
  return (
    <Container>
      {allowedLengths.map((length) => {
        const { isFinished, correctGuess } = gameState.getGameState(
          length as typeof currentWordLength
        );
        const selected = length === currentWordLength;
        return (
          <Button
            selected={selected}
            gameLengthState={
              correctGuess > -1 ? "win" : isFinished ? "lost" : "default"
            }
            onClick={() =>
              gameState.setWordLength(length as typeof currentWordLength)
            }
            key={length}
          >
            <Text
              weight={selected ? 600 : 400}
              color={selected || isFinished ? Colors.White : undefined}
            >
              {length} stafir
            </Text>
          </Button>
        );
      })}
    </Container>
  );
};

export default LengthSelector;
