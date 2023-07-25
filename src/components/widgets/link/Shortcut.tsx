import React from 'react';
import { useAppUIStateContext } from '../../../contexts/AppUIStateContext';
import './Shortcut.css';

interface ShortcutProps {
  readonly shortcut: string | undefined;
  readonly visible: boolean;
  readonly isMouseOver: boolean;
}

export function Shortcut(
  {
    shortcut,
    visible,
    isMouseOver,
  }: ShortcutProps
): JSX.Element | null {
  function isShortcutVisible(): boolean {
    if (!visible) {
      return false;
    }
    if (!shortcut) {
      return false;
    }
    if (!hideShortcuts) {
      return true;
    }
    return isMouseOver;
  }

  const { hideShortcuts } = useAppUIStateContext();

  return isShortcutVisible() ? <kbd className="shortcut">{shortcut}</kbd> : null;
}
