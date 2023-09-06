import { RefObject, useEffect, useRef } from 'react';
import { useModal } from './useModal';

/**
 * Move focus to the first child with the `data-auto-focus` attribute set to true
 * @param id the modal id
 * @returns the visible modal status and the ref to the first modal element
 */
export function useModalAutoFocus<T extends HTMLElement>(id: string): [boolean, RefObject<T>] {
  const { visible } = useModal(id);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (visible && ref.current) {
      const el = ref.current.querySelector('[data-auto-focus="true"]');
      if (el && 'focus' in el) {
        (el as HTMLElement).focus();
      }
    }
  }, [visible, ref]);

  return [visible, ref];
}
