import { useState } from 'react';

export interface UseCollapsedData {
  readonly startCollapsed: boolean;
  readonly collapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
  /**
   * toggle the start collapsed state
   * @returns the new state
   */
  toggleStartCollapsed: () => boolean;
}

/**
 * Manage the collapsed state
 * @param isCollapsedOnStart the initial value for collapsed state
 * @returns the collapsed status and toggle methods
 */
export default function useCollapsed(isCollapsedOnStart: boolean): UseCollapsedData {
  const [startCollapsed, setStartCollapsed] = useState(isCollapsedOnStart);
  const [collapsed, setCollapsed] = useState(startCollapsed);

  return {
    startCollapsed,
    collapsed,
    setCollapsed: (isCollapsed: boolean): void => {
      if (startCollapsed) {
        setCollapsed(isCollapsed);
      }
    },
    toggleStartCollapsed: (): boolean => {
      const state = !startCollapsed;
      setStartCollapsed(prevState => {
        const newState = !prevState;
        setCollapsed(newState);
        return newState;
      });
      return state;
    }
  };
}

