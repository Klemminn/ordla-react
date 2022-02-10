import { createState, useState as useHookState, State } from "@hookstate/core";

type ModalsState = {
  openModal: null | "settings" | "statistics";
};

const getDefaultState = (): ModalsState => ({
  openModal: null,
});

const modalsState = createState<ModalsState>(getDefaultState());

const wrapState = (s: State<ModalsState>) => ({
  getOpenModal: () => s.value.openModal,

  openModal: s.openModal.set,
  closeModals: () => s.openModal.set(null),
});

export const accessState = () => wrapState(modalsState);
export const useState = () => wrapState(useHookState(modalsState));
