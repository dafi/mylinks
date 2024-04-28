import { ChangeEvent, ForwardedRef, forwardRef, InputHTMLAttributes, ReactElement } from 'react';
import { useAutoFocus } from '../../hooks/useAutoFocus/useAutoFocus';
import { InputTextHandle, OnTextType } from './InputTextTypes';

import { useParentValueConsumer } from './useParentValueConsumer';
import { useInputChange } from './useInputChange';

const defaultDebounceTimeout = 1500;

export interface InputTextProps {
  readonly onText?: OnTextType;
  readonly debounceTimeout?: number;
}

export const InputText = forwardRef(function(
  {
    autoFocus,
    defaultValue,
    className,
    debounceTimeout = defaultDebounceTimeout,
    onText,
    onKeyDown
  }: InputTextProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<InputTextHandle>
): ReactElement {
  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    if (onInputChange) {
      onInputChange(e.target.value);
    }
  }

  const inputRef = useAutoFocus<HTMLInputElement>(null, [autoFocus]);
  const onInputChange = useInputChange(debounceTimeout, onText);
  useParentValueConsumer(ref, inputRef);

  return (
    <input
      type="text"
      ref={inputRef}
      className={className}
      defaultValue={defaultValue}
      onKeyDown={onKeyDown}
      onChange={onChange}
    />
  );
});
