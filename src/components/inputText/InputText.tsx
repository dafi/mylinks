import React, { ChangeEvent, ForwardedRef, forwardRef, InputHTMLAttributes, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { debounce } from '../../common/debounce';

export interface InputTextProps {
  onText?: (value: string) => void;
  debounceTimeout?: number;
}

export interface InputTextHandle {
  value(): string;
}

export const InputText = forwardRef(function(
  {
    autoFocus,
    defaultValue,
    className,
    debounceTimeout,
    onText,
    onKeyDown
  }: InputTextProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<InputTextHandle>
): JSX.Element {
  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    if (onInputChange) {
      onInputChange(e.target.value);
    }
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const [onInputChange, setOnInputChange] = useState<(value: string) => void>();

  useEffect(() => {
    if (autoFocus === true) {
      inputRef.current?.focus();
    }
    const userOnChange = onText;
    if (debounceTimeout && userOnChange) {
      const [debounceCallback, stopDebounceCallback] = debounce(a => {
        userOnChange(a as string);
      }, debounceTimeout);
      setOnInputChange(() => debounceCallback);

      return () => {
        stopDebounceCallback();
      };
    } else {
      setOnInputChange(() => userOnChange);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    value(): string {
      return inputRef.current?.value ?? '';
    },
  }), []);

  return <input
    type="text"
    ref={inputRef}
    className={className}
    defaultValue={defaultValue}
    onKeyDown={onKeyDown}
    onChange={onChange}/>;
});
