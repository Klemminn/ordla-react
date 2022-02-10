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
  finished: boolean;
  selected: boolean;
};

const Button = styled.button<ButtonProps>`
  flex: 1;
  margin: 0 0.5rem;
  height: 4rem;
  border: none;
  border-radius: 0.5rem;
  background-color: ${({ finished, selected, theme }) =>
    finished ? Colors.Success : selected ? theme.tone2 : theme.tone5};
`;

const LengthSelector: React.FC = () => {
  const gameState = GameState.useState();
  const currentWordLength = gameState.getWordLength();
  return (
    <Container>
      {allowedLengths.map((length) => {
        const finished = gameState.getIsFinished(
          length as typeof currentWordLength
        );
        const selected = length === currentWordLength;
        return (
          <Button
            selected={selected}
            finished={finished}
            onClick={() =>
              gameState.setWordLength(length as typeof currentWordLength)
            }
            key={length}
          >
            <Text
              weight={selected ? 600 : 400}
              color={selected || finished ? Colors.White : undefined}
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
