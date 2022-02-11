import { useState } from "react";
import styled from "styled-components";
import Countdown, { CountdownRenderProps, zeroPad } from "react-countdown";

import { GameState } from "states";

import Text from "../Text";
import { Modal, ModalProps } from "./common";
import Chart from "./Chart";
import {
  getPercentage,
  getRowStates,
  getSolution,
  isMobile,
  toast,
} from "utils";
import { Colors } from "style";
import { Icons } from "components";

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90%;
`;

const SummaryContainer = styled.div``;

const StatisticsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2rem 15%;
`;

const StatisticsItemContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 3rem;
`;

const Label = styled(Text)`
  text-align: center;
  margin-top: 0.4rem;
  line-height: 1rem;
`;

type StatisticsItemProps = {
  value: number;
  label: string;
};

const StatisticsItem: React.FC<StatisticsItemProps> = ({ value, label }) => (
  <StatisticsItemContainer>
    <Text size={2}>{value}</Text>
    <Label skipTransform size={0.8}>
      {label}
    </Label>
  </StatisticsItemContainer>
);

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BottomTab = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ShareButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.Success};
  border-radius: 0.5rem;
  border: none;
  user-select: none;
  cursor: pointer;
  width: 80%;
  height: 3rem;

  svg {
    margin-left: 0.5rem;
  }
`;

const Title = Text;
Title.defaultProps = {
  size: 1.3,
  weight: 500,
};

const SummaryTitle = styled(Title)`
  text-align: center;
`;

const CountdownContainer = styled.div`
  margin-top: 1rem;
`;

const StyledCountdown: React.FC<CountdownRenderProps> = ({
  hours,
  minutes,
  seconds,
}) => (
  <CountdownContainer>
    <Text size={2}>{`${zeroPad(hours)}:${zeroPad(minutes)}:${zeroPad(
      seconds
    )}`}</Text>
  </CountdownContainer>
);

const StatisticsModal: React.FC<ModalProps> = (props) => {
  const [midnight, setMidnight] = useState(new Date().setHours(24, 0, 0));
  const gameState = GameState.useState();
  const daysFromLaunch = gameState.getDaysFromLaunch();
  const { statistics, correctGuess, isFinished, guesses } =
    gameState.getGameState();
  const wordLength = gameState.getWordLength();

  const handleMidnight = () => {
    setMidnight(new Date().setHours(24, 0, 0));
    gameState.resetGame();
  };

  const handleShare = async () => {
    const solution = await getSolution(wordLength);
    const usedRows = guesses.filter((guess) => guess.length);
    const rowStrings = usedRows.map((row) =>
      getRowStates(row, solution)
        .map((row) =>
          row
            .replaceAll("incorrect", "⬛")
            .replaceAll("correct", "🟩")
            .replaceAll("wrongPlace", "🟨")
        )
        .join("")
    );
    const title = `Orðla ${daysFromLaunch + 1} ${usedRows.length}/6`;
    const footer = "https://ordla.is";
    const whole = `${title}\n\n${rowStrings.join("\n")}\n\n${footer}`;
    const shareData: ShareData = {
      title,
      text: whole,
      url: footer,
    };
    console.log(isMobile());
    if (isMobile() && navigator.canShare(shareData)) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(whole);
      toast("Afritað í klemmuspjald");
    }
  };

  return (
    <Modal {...props} header={`Tölfræði - ${wordLength} stafir`}>
      <ContentContainer>
        <StatisticsContainer>
          <StatisticsItem
            value={statistics.gamesPlayed}
            label="Fjöldi leikja"
          />
          <StatisticsItem
            value={getPercentage(statistics.gamesWon, statistics.gamesPlayed)}
            label="% sigurhlutfall"
          />
          <StatisticsItem
            value={statistics.currentStreak}
            label="Sigrar í röð"
          />
          <StatisticsItem value={statistics.maxStreak} label="Lengsta röð" />
        </StatisticsContainer>
        <SummaryContainer>
          <SummaryTitle>Dreifing</SummaryTitle>
          <Chart statistics={statistics} correctGuess={correctGuess} />
        </SummaryContainer>
        <BottomContainer>
          {isFinished && (
            <>
              <BottomTab>
                <Title>Næsta orðla</Title>
                <Countdown
                  date={midnight}
                  renderer={StyledCountdown}
                  onComplete={handleMidnight}
                />
              </BottomTab>
              <BottomTab onClick={handleShare}>
                <ShareButton>
                  <Title color={Colors.White}>Deila</Title>
                  <Icons.Share fill={Colors.White} />
                </ShareButton>
              </BottomTab>
            </>
          )}
        </BottomContainer>
      </ContentContainer>
    </Modal>
  );
};

export default StatisticsModal;
