import { ReactElement } from 'react';
import { useAppUIStateContext } from '../../contexts/AppUIStateContext';
import { KeyCombination } from '../../model/KeyCombination';
import { combinationToSymbols } from './ShortcutUtil';
import './Shortcut.css';

interface ShortcutProps {
  readonly shortcut: KeyCombination[] | undefined;
  readonly visible: boolean;
  readonly isMouseOver: boolean;
  readonly scrollToLast?: boolean;
}

const defaultProps = {
  scrollToLast: false
};

export function Shortcut(
  {
    shortcut,
    visible,
    isMouseOver,
    scrollToLast,
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

  function makeVisibleElement(el: HTMLElement | null, index: number): void {
    if (el !== null && visible && scrollToLast === true && shortcut && shortcut.length - 1 === index ) {
      el.scrollIntoView({ inline: 'end' });
    }
  }

  if (isShortcutVisible()) {
    return (
      <>
        {shortcut?.map((s, i) =>
          /* eslint-disable-next-line react/no-array-index-key */
          <kbd className="shortcut" key={s.key + i.toString()} ref={node => makeVisibleElement(node, i)}>
            {combinationToSymbols(s)}
          </kbd>
        )}
      </>
    );
  }
  return null;
}

Shortcut.defaultProps = defaultProps;
