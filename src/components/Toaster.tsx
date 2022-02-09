import { Toaster as ReactHotToaster } from "react-hot-toast";
import { useTheme } from "styled-components";

const Toaster: React.FC = () => {
  const theme = useTheme();
  return (
    <ReactHotToaster
      containerStyle={{ top: 150 }}
      toastOptions={{
        style: {
          backgroundColor: theme.tone1,
          color: theme.tone5,
          fontFamily: "Clear Sans, Helvetica Neue, Arial, sans-serif",
          fontWeight: 600,
        },
      }}
    />
  );
};

export default Toaster;
