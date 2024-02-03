import { HotKey } from '../../model/KeyCombination';

export type Shortcut = {
  readonly label: string;
  readonly callback: () => void;
} & Readonly<HotKey>;
