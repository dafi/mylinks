export type KeyCombination = string;

export interface Shortcut {
  readonly shortcut: KeyCombination;
  readonly type: 'system' | 'link' | 'linkArray';
}
