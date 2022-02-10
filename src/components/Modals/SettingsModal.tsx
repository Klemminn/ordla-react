import styled from "styled-components";
import ReactSwitch from "react-switch";

import { Modal, ModalProps } from "./common";
import Text from "../Text";
import { SettingsState } from "states";

const SettingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid grey;
  height: 4rem;
`;

const LabelContainer = styled.div``;

type SettingProps = {
  label: string;
  onChange(value: boolean): void;
  value: boolean;
  description?: string;
};

const Setting: React.FC<SettingProps> = ({
  label,
  onChange,
  description,
  value,
}) => (
  <SettingContainer>
    <LabelContainer>
      <Text size={1} skipTransform weight={600}>
        {label}
      </Text>
      {!description ? null : (
        <Text size={0.8} skipTransform>
          {description}
        </Text>
      )}
    </LabelContainer>
    <ReactSwitch checked={value} onChange={onChange} />
  </SettingContainer>
);

const SettingsModal: React.FC<ModalProps> = (props) => {
  const settingsState = SettingsState.useState();
  const { isDarkTheme, isHardMode } = settingsState.get();
  return (
    <Modal {...props} header="Stillingar">
      <Setting
        label="Erfiðari útgáfan"
        description="Notast þarf við alla þekkta stafi"
        value={isHardMode}
        onChange={settingsState.setIsHardMode}
      />
      <Setting
        label="Rökkurhamur"
        value={isDarkTheme}
        onChange={settingsState.setIsDarkTheme}
      />
    </Modal>
  );
};

export default SettingsModal;
