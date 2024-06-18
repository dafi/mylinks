import { CSSProperties } from 'react';
import { isNotEmptyString } from '../../common/StringUtil';

export type AppToolbarButtonType = 'button' | 'file';

export interface AppToolbarButtonProps {
  readonly title: string;
  readonly className: string;
  readonly action: string;
  readonly icon: string;
  readonly onAction: (action: string | undefined, data?: unknown) => void;
  readonly type?: AppToolbarButtonType;
  readonly style?: CSSProperties | undefined;
  readonly data?: unknown;
}

const actions = [
  'loadConfig',
  'toggleShortcuts',
  'openSettings',
  'findLinks',
  'addWidget',
  'expandAllWidgets',
  'collapseAllWidgets',
] as const;

export type AppToolbarActionType = typeof actions[number];

export function isAction(action: string | undefined): action is AppToolbarActionType {
  return isNotEmptyString(action) && actions.includes(action as AppToolbarActionType);
}

