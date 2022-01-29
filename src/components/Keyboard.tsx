import { useEffect, useRef } from "react";

import styled from "styled-components";
import { UsedKeysStatus } from "types";
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
  ["á", "é", "í", "ó", "ú", "ý", "ö"],
  ["e", "r", "t", "y", "u", "i", "o", "p", "ð"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "æ"],
  ["enter", "x", "v", "b", "n", "m", "þ", "backspace"],
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
  usedKeyStatus: UsedKeysStatus;
  value: string;
};

const Keyboard: React.FC<KeyboardProps> = ({
  onChange,
  onEnter,
  usedKeyStatus,
  value,
}) => {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);

  const handleChange = (key: string) => {
    if (key === "enter") {
      onEnter();
    } else if (key === "backspace" && value.length) {
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
                ? "backspace"
                : e.target.value.slice(-1)
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
