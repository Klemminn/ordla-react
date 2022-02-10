import { useEffect, useRef } from "react";
import styled, { useTheme } from "styled-components";

import { Colors } from "style";
import { UsedKeysStatus, KeyStatus } from "types";
import Text from "./Text";
import { Icons } from "components";

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
  ["á", "é", "í", "ó", "ú", "ý", "ö", "backspace"],
  ["e", "r", "t", "y", "u", "i", "o", "p", "ð"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "æ"],
  ["x", "v", "b", "n", "m", "þ", "enter"],
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

type KeyButtonProps = {
  usedStatus: KeyStatus;
};

const KeyButton = styled.button<KeyButtonProps>`
  flex: 1;
  border: 0;
  padding: 0.5rem;
  margin: 0 0.3rem 0.3rem 0;
  height: 4rem;
  border-radius: 0.2rem;
  background-color: ${({ theme, usedStatus }) =>
    usedStatus === "correct"
      ? Colors.Success
      : usedStatus === "incorrect"
      ? theme.absentBackground
      : usedStatus === "wrongPlace"
      ? Colors.Warning
      : theme.keyBackground};
`;

const getUsedStatus = (key: string, usedKeyStatus: UsedKeysStatus): KeyStatus =>
  usedKeyStatus.correct.includes(key)
    ? "correct"
    : usedKeyStatus.wrongPlace.includes(key)
    ? "wrongPlace"
    : usedKeyStatus.incorrect.includes(key)
    ? "incorrect"
    : "default";

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
  const theme = useTheme();

  const iconFill = theme.tone1;

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
          value={value ?? ""}
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
          inputMode="none"
        />
      </InputContainer>
      {keyRows.map((row) => (
        <RowContainer key={row[0]}>
          {row.map((key) => {
            const usedStatus = getUsedStatus(key, usedKeyStatus);
            return (
              <KeyButton
                key={key}
                onClick={() => handleChange(key)}
                usedStatus={usedStatus}
              >
                <Text
                  size={1.3}
                  weight={600}
                  color={usedStatus !== "default" ? Colors.White : undefined}
                >
                  {key === "enter" ? (
                    "giska"
                  ) : key === "backspace" ? (
                    <Icons.Backspace fill={iconFill} />
                  ) : (
                    key
                  )}
                </Text>
              </KeyButton>
            );
          })}
        </RowContainer>
      ))}
    </KeyboardContainer>
  );
};

export default Keyboard;
