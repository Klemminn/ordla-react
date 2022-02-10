import { ModalsState } from "states";
import { useTheme } from "styled-components";

import { ModalProps } from "./common";
import SettingsModal from "./SettingsModal";
import StatisticsModal from "./StatisticsModal";

const Modals: React.FC = () => {
  const modalsState = ModalsState.useState();
  const theme = useTheme();
  const openModal = modalsState.getOpenModal();
  const style: ModalProps["style"] = {
    overlay: {
      backgroundColor: "rgba(0,0,0,0.2)",
      display: "flex",
      justifyContent: "center",
      padding: "5rem",
    },
    content: {
      backgroundColor: theme.tone7,
      color: theme.tone1,
      position: "relative",
      inset: 0,
      width: "500px",
      maxHeight: "700px",
    },
  };

  return (
    <>
      <SettingsModal
        isOpen={openModal === "settings"}
        onRequestClose={modalsState.closeModals}
        style={style}
      />
      <StatisticsModal
        isOpen={openModal === "statistics"}
        onRequestClose={modalsState.closeModals}
        style={style}
      />
    </>
  );
};

export default Modals;
