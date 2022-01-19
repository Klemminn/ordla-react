import { DefaultTheme } from "styled-components";
import { Colors } from "./Colors";

declare module "styled-components" {
  export interface DefaultTheme {
    keyBackground: Colors;
    tone1: Colors;
    tone2: Colors;
    tone3: Colors;
    tone4: Colors;
    tone5: Colors;
    tone6: Colors;
    tone7: Colors;
  }
}

export const LightTheme: DefaultTheme = {
  keyBackground: Colors.LightTone4,
  tone1: Colors.LightTone1,
  tone2: Colors.LightTone2,
  tone3: Colors.LightTone3,
  tone4: Colors.LightTone4,
  tone5: Colors.LightTone5,
  tone6: Colors.LightTone6,
  tone7: Colors.LightTone7,
};

export const DarkTheme: DefaultTheme = {
  keyBackground: Colors.DarkTone2,
  tone1: Colors.DarkTone1,
  tone2: Colors.DarkTone2,
  tone3: Colors.DarkTone3,
  tone4: Colors.DarkTone4,
  tone5: Colors.DarkTone5,
  tone6: Colors.DarkTone6,
  tone7: Colors.DarkTone7,
};
