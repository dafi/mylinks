import { ShortcutList } from '../../model/MyLinks-interface';

export type Shortcut = {
  readonly callback: () => void;
} & Readonly<ShortcutList>;
