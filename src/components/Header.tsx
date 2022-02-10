import styled, { useTheme } from "styled-components";

import { ModalsState } from "states";
import * as Icons from "./Icons";
import Text from "./Text";

const HeaderContainer = styled.div`
  display: flex;
  height: 4rem;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: ${({ theme }) => theme.tone4} solid 1px;
  padding: 0.2rem 0;

  svg {
    margin: 0.3rem;
    cursor: pointer;
  }
`;

const GroupContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

const IconGroupContainer = styled(GroupContainer)`
  justify-content: flex-end;
`;

const Header: React.FC = () => {
  const theme = useTheme();

  const iconFill = theme.tone3;

  return (
    <HeaderContainer>
      <GroupContainer>
        {/*<Icons.QuestionMark fill={iconFill} />*/}
      </GroupContainer>
      <GroupContainer>
        <Text size={2.3} weight={700} spread>
          Orðla
        </Text>
      </GroupContainer>
      <IconGroupContainer>
        <Icons.Chart
          fill={iconFill}
          onClick={() => ModalsState.accessState().openModal("statistics")}
        />
        <Icons.Cog
          fill={iconFill}
          onClick={() => ModalsState.accessState().openModal("settings")}
        />
      </IconGroupContainer>
    </HeaderContainer>
  );
};

export default Header;
