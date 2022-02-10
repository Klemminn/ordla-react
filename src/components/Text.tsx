import { Colors } from "style";
import styled from "styled-components";

type TextProps = {
  size?: number;
  weight?: number;
  spread?: boolean;
  color?: Colors;
  skipTransform?: boolean;
};

const Text = styled.div<TextProps>`
  text-transform: ${({ skipTransform }) => (skipTransform ? "" : "uppercase")};
  font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
  color: ${({ theme, color }) => color ?? theme.tone1};
  font-size: ${({ size = 1 }) => `${size}rem`};
  font-weight: ${({ weight = 400 }) => weight};
  letter-spacing: ${({ spread }) => (spread ? "0.2" : "0")}rem;
  cursor: default;
`;

export default Text;
