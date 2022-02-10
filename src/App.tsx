import { Game, Modals, ThemeContainer, Toaster } from "components";

const App: React.FC = () => (
  <ThemeContainer>
    <Modals />
    <Toaster />
    <Game />
  </ThemeContainer>
);

export default App;
