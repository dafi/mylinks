import { DependencyList, RefObject, useEffect, useRef } from 'react';

export function useAutoFocus<T extends HTMLElement>(
  initValue: T | null,
  deps?: DependencyList | undefined
): RefObject<T> {
  const ref = useRef<T>(initValue);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => ref.current?.focus(), deps);

  return ref;
}
