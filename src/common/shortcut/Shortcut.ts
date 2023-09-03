export type KeyCombination = string;

export interface Shortcut {
  readonly shortcut: KeyCombination;
  readonly callback: () => void;
}
