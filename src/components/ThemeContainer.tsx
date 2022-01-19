import { createGlobalStyle, ThemeProvider } from "styled-components";

import { useTheme } from "hooks";

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
  }
  body {
    height: 100%;
    margin: 0;
    background-color: ${({ theme }) => theme.tone7};
  }
  #root {
    display: flex;
    justify-content: center;
    height: 100%;
  }

  @media (max-width: 500px) {
  html {
    font-size: 70%;
  }
}
@media (min-width: 1400px) {
  html {
    font-size: 100%;
  }
}
`;

const ThemeContainer: React.FC = (props) => {
  const theme = useTheme();

  return (
    <>
      <GlobalStyle theme={theme} />
      <ThemeProvider theme={theme} {...props} />
    </>
  );
};

export default ThemeContainer;
