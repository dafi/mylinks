import { HotKey } from './KeyCombination';

export const AppActionList = ['openAllLinks', 'findLinks', 'toggleShortcuts', 'editSettings'] as const;

export type AppActionType = (typeof AppActionList)[number];

export type AppAction = {
  action: AppActionType;
} & HotKey;
