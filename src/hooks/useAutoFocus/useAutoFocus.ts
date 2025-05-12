import { RefObject, useEffect, useRef } from 'react';

export function useAutoFocus<T extends HTMLElement>(
  initValue: T | null,
  deps: boolean | undefined
): RefObject<T | null> {
  const ref = useRef(initValue);

  useEffect(() => ref.current?.focus(), [deps]);

  return ref;
}
