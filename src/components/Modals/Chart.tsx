import styled from "styled-components";

import { GameState } from "states";
import { Colors } from "style";
import { getPercentage } from "utils";

import Text from "../Text";

const ChartContainer = styled.div`
  margin: 5% 10%;
`;

const LineContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 0.2rem;
  align-items: center;
`;

const Label = styled(Text)`
  margin-right: 1rem;
`;

type ColumnProps = {
  width: number;
  current: boolean;
};

const Column = styled(Text)<ColumnProps>`
  background-color: ${({ current, theme }) =>
    current ? Colors.Success : theme.tone3};
  min-width: 1rem;
  width: ${({ width }) => width}%;
  padding: 0.2rem 0.4rem;
  text-align: right;
`;

type LineProps = {
  number: string;
  max: number;
  value: number;
  current: boolean;
};

const Line: React.FC<LineProps> = ({ number, value, max, current }) => (
  <LineContainer>
    <Label>{number}</Label>
    <Column
      color={Colors.White}
      width={getPercentage(value, max)}
      current={current}
      weight={600}
    >
      {value}
    </Column>
  </LineContainer>
);

type ChartProps = {
  correctGuess: number;
  statistics: GameState.Statistics;
};

const Chart: React.FC<ChartProps> = ({ correctGuess, statistics }) => {
  const { numberOfGuesses } = statistics;
  const numberArray = Object.keys(numberOfGuesses).filter(
    (number) => !isNaN(Number(number))
  );
  numberArray.sort();
  const max = numberArray.reduce((currentMax, number) => {
    const current = numberOfGuesses[number as keyof typeof numberOfGuesses];
    return current > currentMax ? current : currentMax;
  }, 0);
  return (
    <ChartContainer>
      {numberArray.map((number) => (
        <Line
          key={number}
          number={number}
          value={numberOfGuesses[number as keyof typeof numberOfGuesses]}
          max={max}
          current={Number(number) === correctGuess}
        />
      ))}
    </ChartContainer>
  );
};

export default Chart;
