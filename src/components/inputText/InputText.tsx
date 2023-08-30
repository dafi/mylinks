import { ChangeEvent, ForwardedRef, forwardRef, InputHTMLAttributes, ReactElement, useEffect, useImperativeHandle, useState } from 'react';
import { debounce } from '../../common/debounce';
import { useAutoFocus } from '../../hooks/useAutoFocus/useAutoFocus';

const defaultDebounceTimeout = 1500;

export interface InputTextProps {
  readonly onText?: (value: string) => void;
  readonly debounceTimeout?: number;
}

const defaultProps = {
  onText: undefined,
  debounceTimeout: defaultDebounceTimeout
};

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
): ReactElement {
  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    if (onInputChange) {
      onInputChange(e.target.value);
    }
  }

  const inputRef = useAutoFocus<HTMLInputElement>(null, [autoFocus]);
  const [onInputChange, setOnInputChange] = useState<(value: string) => void>();

  useEffect(() => {
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
  }, [onText, debounceTimeout]);

  useImperativeHandle(ref, () => ({
    value(): string {
      return inputRef.current?.value ?? '';
    },
  }), [inputRef]);

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

InputText.defaultProps = defaultProps;
