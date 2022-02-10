import { useEffect } from "react";
import { SettingsState } from "states";

import { Themes } from "style";
import { darkThemeIdentifier } from "const";

const useTheme = () => {
  const settingsState = SettingsState.useState();
  const { isDarkTheme } = settingsState.get();
  const mediaQueryListener = (e: MediaQueryListEvent) => {
    settingsState.setIsDarkTheme(e.matches);
  };

  useEffect(() => {
    const darkThemeMediaQuery = window.matchMedia(darkThemeIdentifier);
    darkThemeMediaQuery.addEventListener("change", mediaQueryListener);
    return () =>
      darkThemeMediaQuery.removeEventListener("change", mediaQueryListener);
    // eslint-disable-next-line
  }, []);

  return isDarkTheme ? Themes.DarkTheme : Themes.LightTheme;
};

export default useTheme;
