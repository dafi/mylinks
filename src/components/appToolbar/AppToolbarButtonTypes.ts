import { CSSProperties } from 'react';
import { isNotEmptyString } from '../../common/StringUtil';

export type AppToolbarButtonType = 'button' | 'file';

export type AppToolbarButtonProps = Readonly<{
  title: string;
  className: string;
  action: string;
  icon: string;
  onAction: (action: string | undefined, data?: unknown) => void;
  type?: AppToolbarButtonType;
  style?: CSSProperties | undefined;
  data?: unknown;
}>;

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

