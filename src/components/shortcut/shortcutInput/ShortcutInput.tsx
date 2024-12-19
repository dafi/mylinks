import { Dispatch, KeyboardEvent, ReactNode, SetStateAction, useRef } from 'react';
import './ShortcutInput.css';
import { KeyCombination } from '../../../model/KeyCombination';
import { Shortcut } from '../Shortcut';

type ShortcutInputProps = Readonly<{
  autoFocus?: boolean;
  keyCombination: KeyCombination[];
  setKeyCombination: Dispatch<SetStateAction<KeyCombination[]>>;
}>;

export const ShortcutInput = function(
  {
    autoFocus = false,
    keyCombination,
    setKeyCombination,
  }: ShortcutInputProps,
): ReactNode {
  function onKeyDown(e: KeyboardEvent<HTMLElement>): void {
    if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey || e.key === 'Enter') {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    if (overwriteInitialValue.current) {
      setKeyCombination(prevState => [...prevState, { key: e.key }]);
    } else {
      overwriteInitialValue.current = true;
      setKeyCombination([{ key: e.key }]);
    }
  }

  function clear(): void {
    inputRef.current?.focus();
    overwriteInitialValue.current = true;
    setKeyCombination([]);
  }

  const overwriteInitialValue = useRef(false);
  const inputRef = useRef<HTMLDivElement>(null);

  return (
    <div className="shortcut-input-container">
      <div
        data-auto-focus={autoFocus}
        tabIndex={0}
        className="shortcut-combination"
        onKeyDown={onKeyDown}
        ref={inputRef}
      >
        <div>
          <Shortcut
            shortcut={keyCombination}
            visible
            isMouseOver
            scrollToLast
          />
        </div>
      </div>
      <div className="shortcut-clear" onClick={clear}>
        <i className="fas fa-times" />
      </div>
    </div>
  );
};
