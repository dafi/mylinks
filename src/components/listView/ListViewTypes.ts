import { KeyboardEvent, ReactElement } from 'react';

export type ListViewItem = {
  id: string;
  element: ReactElement;
};

export type ListViewHandle = {
  onKeyDown(e: KeyboardEvent<HTMLElement>): void;
};

