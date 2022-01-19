import { useEffect, useState } from "react";

import { Themes } from "style";

const DARK_THEME_IDENTIFIER = "(prefers-color-scheme: dark)";

const getCurrentTheme = () => window.matchMedia(DARK_THEME_IDENTIFIER).matches;

const useTheme = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());
  const mediaQueryListener = (e: MediaQueryListEvent) => {
    setIsDarkTheme(e.matches);
  };

  useEffect(() => {
    const darkThemeMediaQuery = window.matchMedia(DARK_THEME_IDENTIFIER);
    darkThemeMediaQuery.addEventListener("change", mediaQueryListener);
    return () =>
      darkThemeMediaQuery.removeEventListener("change", mediaQueryListener);
  }, []);

  return isDarkTheme ? Themes.DarkTheme : Themes.LightTheme;
};

export default useTheme;
