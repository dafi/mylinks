import { ReactElement } from 'react';

import { splitShortcut } from '../../../common/ShortcutUtil';
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
): ReactElement | null {
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

  if (isShortcutVisible()) {
    return (
      <>
        {/* eslint-disable-next-line react/no-array-index-key */}
        {splitShortcut(shortcut).map((s, i) => <kbd key={i} className="shortcut">{s}</kbd>)}
      </>
    );
  }
  return null;
}
