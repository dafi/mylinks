import { KeyboardEvent, ReactNode } from 'react';

export type ListViewItem = {
  id: string;
  element: ReactNode;
};

export type ListViewHandle = {
  onKeyDown(e: KeyboardEvent<HTMLElement>): void;
};

