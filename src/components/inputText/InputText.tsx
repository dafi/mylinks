import { ChangeEvent, ComponentPropsWithoutRef, ReactNode, RefObject } from 'react';
import { useAutoFocus } from '../../hooks/useAutoFocus/useAutoFocus';
import { InputTextHandle, OnTextType } from './InputTextTypes';
import { useInputChange } from './useInputChange';
import { useParentValueConsumer } from './useParentValueConsumer';

const defaultDebounceTimeout = 1500;

export type InputTextProps = Readonly<{
  ref: RefObject<InputTextHandle | null>;
  onText?: OnTextType;
  debounceTimeout?: number;
}> & ComponentPropsWithoutRef<'input'>;

export function InputText(
  {
    ref,
    autoFocus,
    defaultValue,
    className,
    debounceTimeout = defaultDebounceTimeout,
    onText,
    onKeyDown
  }: InputTextProps
): ReactNode {
  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    if (onInputChange) {
      onInputChange(e.target.value);
    }
  }

  const inputRef = useAutoFocus<HTMLInputElement>(null, autoFocus);
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
}
