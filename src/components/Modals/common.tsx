import ReactModal, { Props as ReactModalProps } from "react-modal";
import styled from "styled-components";

import Text from "../Text";

ReactModal.setAppElement("#root");

const Header = styled(Text)`
  text-align: center;
`;

export type ModalProps = ReactModalProps & {
  header?: string;
};

export const Modal: React.FC<ModalProps> = ({ header, children, ...rest }) => (
  <ReactModal {...rest}>
    <Header size={1.5}>{header}</Header>
    {children}
  </ReactModal>
);
