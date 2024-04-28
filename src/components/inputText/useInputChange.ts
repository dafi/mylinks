import { useEffect, useState } from 'react';
import { debounce } from '../../common/debounce';
import { OnTextType } from './InputTextTypes';

export function useInputChange(
  debounceTimeout: number | undefined,
  onText: OnTextType | undefined
): OnTextType | undefined {
  const [onInputChange, setOnInputChange] = useState<OnTextType>();

  useEffect(() => {
    const userOnChange = onText;
    if (typeof debounceTimeout === 'number' && userOnChange) {
      const [debounceCallback, stopDebounceCallback] = debounce(a => {
        userOnChange(a as string);
      }, debounceTimeout);
      setOnInputChange(() => debounceCallback);

      return (): void => {
        stopDebounceCallback();
      };
    } else {
      setOnInputChange(() => userOnChange);
    }
    return void 0;
  }, [onText, debounceTimeout]);

  return onInputChange;
}
