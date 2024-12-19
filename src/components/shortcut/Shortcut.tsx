import { ReactNode } from 'react';
import { useAppUIStateContext } from '../../contexts/AppUIStateContext';
import { KeyCombination } from '../../model/KeyCombination';
import { combinationToSymbols } from './ShortcutUtil';
import './Shortcut.css';

type ShortcutProps = Readonly<{
  shortcut: KeyCombination[] | undefined;
  visible: boolean;
  isMouseOver: boolean;
  scrollToLast?: boolean;
}>;

export function Shortcut(
  {
    shortcut,
    visible,
    isMouseOver,
    scrollToLast = false,
  }: ShortcutProps
): ReactNode {
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

  function makeVisibleElement(el: HTMLElement | null, index: number): void {
    if (el !== null && visible && scrollToLast && shortcut && shortcut.length - 1 === index ) {
      el.scrollIntoView({ inline: 'end' });
    }
  }

  if (isShortcutVisible()) {
    return (
      <>
        {shortcut?.map((s, i) =>
          <kbd className="shortcut" key={s.key + i.toString()} ref={node => makeVisibleElement(node, i)}>
            {combinationToSymbols(s)}
          </kbd>
        )}
      </>
    );
  }
  return null;
}
