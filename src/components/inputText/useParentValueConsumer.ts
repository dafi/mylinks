import { ForwardedRef, RefObject, useImperativeHandle } from 'react';
import { InputTextHandle } from './InputTextTypes';

/**
 * Expose to the parent the InputTextHandle interface
 * @param parentRef the parent ref
 * @param valueRef the value element ref
 */
export function useParentValueConsumer<T extends HTMLInputElement>(
  parentRef: ForwardedRef<InputTextHandle>,
  valueRef: RefObject<T>,
): void {
  useImperativeHandle(parentRef, () => ({
    value(): string {
      return valueRef.current?.value ?? '';
    },
  }), [valueRef]);
}
