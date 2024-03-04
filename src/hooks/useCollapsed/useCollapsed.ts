import { MouseEventHandler, useState } from 'react';

export type OnCollapseEventHandler = {
  onMouseEnter: MouseEventHandler<HTMLElement>;
  onMouseLeave: MouseEventHandler<HTMLElement>;
};

export type UseCollapsedData = {
  readonly startCollapsed: boolean;
  readonly collapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
  /**
   * toggle the start collapsed state
   * @returns the new state
   */
  toggleStartCollapsed: () => boolean;
  onCollapse: OnCollapseEventHandler | undefined;
};

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
    setCollapsed,
    toggleStartCollapsed: (): boolean => {
      const toggled = !startCollapsed;
      setStartCollapsed(toggled);
      setCollapsed(toggled);
      return toggled;
    },
    onCollapse: startCollapsed ? {
      onMouseEnter: (): void => setCollapsed(false),
      onMouseLeave: (): void => setCollapsed(true),
    } : undefined
  };
}
