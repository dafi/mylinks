type StackItem = {
  id: string;
  element: HTMLElement;
};

const modalStack: StackItem[] = [];

/**
 * Update the stack adding or deleting the passed {@link element}
 * @param id
 * @param visible
 * @param element
 * @returns true if element was removed, false otherwise
 */
export function updateStack(
  id: string,
  visible: boolean,
  element: HTMLElement | null
): boolean {
  if (visible) {
    if (element) {
      modalStack.push({ id, element });
      return false;
    }
  } else {
    const index = modalStack.findIndex(v => v.id === id);
    if (index >= 0) {
      modalStack.splice(index, 1);
      return true;
    }
  }
  return false;
}

export const focusLast = (): void => modalStack.at(-1)?.element.focus();
export const isStackEmpty = (): boolean => modalStack.length === 0;
export const stackSize = (): number => modalStack.length;
