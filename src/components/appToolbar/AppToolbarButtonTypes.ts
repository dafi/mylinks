import { CSSProperties } from 'react';

export type AppToolbarButtonType = 'button' | 'file';

export interface AppToolbarButtonProps {
  readonly title: string;
  readonly className: string;
  readonly action: string;
  readonly icon: string;
  readonly onAction: (action: string | undefined, data?: unknown) => void;
  readonly type?: AppToolbarButtonType;
  readonly style?: CSSProperties | undefined;
}

const actions = [
  'loadConfig', 'saveConfig', 'shortcut',
] as const;

export type AppToolbarActionType = typeof actions[number];

export function isAction(action: string | undefined): action is AppToolbarActionType {
  return !!action && actions.includes(action as AppToolbarActionType);
}

