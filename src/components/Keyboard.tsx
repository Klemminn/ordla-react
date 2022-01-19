import { useEffect, useRef } from "react";

import styled from "styled-components";
import Text from "./Text";

const InputContainer = styled.div`
  height: 0;
  width: 0;
`;

const Input = styled.input`
  opacity: 0;
  height: 0;
  width: 0;
`;

const keyRows = [
  ["Á", "É", "Í", "Ó", "Ú", "Ý", "Ö"],
  ["E", "R", "T", "Y", "U", "I", "O", "P", "Ð"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Æ"],
  ["ENTER", "X", "V", "B", "N", "M", "Þ", "BACKSPACE"],
];

const validKeys = keyRows.reduce(
  (keys, row) => keys + row.filter((key) => key.length === 1).join(""),
  ""
);

const KeyboardContainer = styled.div`
  width: 100%;
  max-width: 500px;
`;

const RowContainer = styled.div`
  display: flex;
  width: 100%;
  > *:last-child {
    margin-right: 0;
  }
`;

const KeyButton = styled.button`
  flex: 1;
  border: 0;
  padding: 0.5rem;
  margin: 0 0.3rem 0.3rem 0;
  height: 3rem;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.keyBackground};
`;

type KeyboardProps = {
  onChange(value: string): void;
  onEnter(): void;
  correctKeys: string;
  incorrectKeys: string;
  wrongPlaceKeys: string;
  value: string;
};

const Keyboard: React.FC<KeyboardProps> = ({
  onChange,
  onEnter,
  correctKeys,
  incorrectKeys,
  wrongPlaceKeys,
  value,
}) => {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);

  const handleChange = (key: string) => {
    if (key === "ENTER") {
      onEnter();
    } else if (key === "BACKSPACE" && value.length) {
      const newValue = value.substring(0, value.length - 1);
      onChange(newValue);
    } else if (validKeys.includes(key)) {
      onChange(value + key);
    }
  };

  return (
    <KeyboardContainer>
      <InputContainer>
        <Input
          ref={input}
          onBlur={() => input.current?.focus()}
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            handleChange(
              value.length > newValue.length
                ? "BACKSPACE"
                : e.target.value.slice(-1).toUpperCase()
            );
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              onEnter();
            }
          }}
        />
      </InputContainer>
      {keyRows.map((row) => (
        <RowContainer key={row[0]}>
          {row.map((key) => (
            <KeyButton key={key} onClick={() => handleChange(key)}>
              <Text size={1.2} weight={600}>
                {key}
              </Text>
            </KeyButton>
          ))}
        </RowContainer>
      ))}
    </KeyboardContainer>
  );
};

export default Keyboard;
