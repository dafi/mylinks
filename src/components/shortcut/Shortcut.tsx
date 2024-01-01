import { ReactElement } from 'react';
import { useAppUIStateContext } from '../../contexts/AppUIStateContext';
import { KeyCombination } from '../../model/KeyCombination';
import { combinationToHtml } from './ShortcutUtil';
import './Shortcut.css';

interface ShortcutProps {
  readonly shortcut: KeyCombination[] | undefined;
  readonly visible: boolean;
  readonly isMouseOver: boolean;
}

export function Shortcut(
  {
    shortcut,
    visible,
    isMouseOver,
  }: ShortcutProps
): ReactElement | null {
  function isShortcutVisible(): boolean {
    if (!visible) {
      return false;
    }
    if (shortcut == null || shortcut.length === 0) {
      return false;
    }
    if (!hideShortcuts) {
      return true;
    }
    return isMouseOver;
  }

  const { hideShortcuts } = useAppUIStateContext();

  if (isShortcutVisible()) {
    return (
      <>
        {/* eslint-disable-next-line react/no-array-index-key */}
        {shortcut?.map((s, i) => combinationToHtml(s, i))}
      </>
    );
  }
  return null;
}
