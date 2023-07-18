import { useState } from 'react';

export interface UseCollapsedData {
  readonly startCollapsed: boolean;
  readonly collapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
  toggleStartCollapsed: () => void;
}

/**
 * Custom hook to manage the collapsed state
 * @param collapsedId the id used to persist the status on localStorage
 * @returns the collapsed status and toggle methods
 */
export default function useCollapsed(collapsedId: string): UseCollapsedData {
  const itemId = `${collapsedId}-collapsed`;
  const [startCollapsed, setStartCollapsed] = useState(localStorage.getItem(itemId) === 't');
  const [collapsed, setCollapsed] = useState(startCollapsed);

  return {
    startCollapsed,
    collapsed,
    setCollapsed: (isCollapsed: boolean): void => {
      if (startCollapsed) {
        setCollapsed(isCollapsed);
      }
    },
    toggleStartCollapsed: (): void => {
      setStartCollapsed(prevState => {
        const newState = !prevState;
        localStorage.setItem(itemId, newState ? 't' : 'f');
        setCollapsed(newState);
        return newState;
      });
    }
  };
}

