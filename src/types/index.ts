export type TileState = "default" | "correct" | "incorrect" | "wrongPlace";

export type UsedKeysStatus = {
  correct: string[];
  wrongPlace: string[];
  incorrect: string[];
};
