import { createState, useState as useHookState, State } from "@hookstate/core";
import { Persistence } from "@hookstate/persistence";

import { darkThemeIdentifier } from "const";

type SettingsState = {
  isDarkTheme: boolean;
  isHardMode: boolean;
};

const getDefaultState = (): SettingsState => ({
  isDarkTheme: window.matchMedia(darkThemeIdentifier).matches,
  isHardMode: false,
});

const settingsState = createState<SettingsState>(getDefaultState());
const persistenceStateKey = "settingsState";
settingsState.attach(Persistence(persistenceStateKey));

const wrapState = (s: State<SettingsState>) => ({
  get: () => s.value,
  setIsDarkTheme: s.isDarkTheme.set,
  setIsHardMode: s.isHardMode.set,
});

export const accessState = () => wrapState(settingsState);
export const useState = () => wrapState(useHookState(settingsState));
