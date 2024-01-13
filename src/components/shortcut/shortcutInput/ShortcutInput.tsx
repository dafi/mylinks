import { Dispatch, KeyboardEvent, ReactElement, SetStateAction, useRef } from 'react';
import './ShortcutInput.css';
import { useAutoFocus } from '../../../hooks/useAutoFocus/useAutoFocus';
import { KeyCombination } from '../../../model/KeyCombination';
import { Shortcut } from '../Shortcut';

type ShortcutInputProps = {
  readonly keyCombination: KeyCombination[];
  readonly setKeyCombination: Dispatch<SetStateAction<KeyCombination[]>>;
};

export const ShortcutInput = function(
  {
    keyCombination,
    setKeyCombination,
  }: ShortcutInputProps,
): ReactElement {
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
  const inputRef = useAutoFocus<HTMLDivElement>(null);

  return (
    <div className="shortcut-input-container">
      <div
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
