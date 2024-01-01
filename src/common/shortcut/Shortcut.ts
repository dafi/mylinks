import { KeyCombination } from '../../model/KeyCombination';

export type Shortcut = {
  readonly shortcut: KeyCombination[];
  readonly callback: () => void;
};
