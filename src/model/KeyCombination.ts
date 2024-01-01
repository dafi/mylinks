export type KeyCombination = {
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  key: string;
};

export const KeyModifierList = ['altKey', 'metaKey', 'ctrlKey', 'shiftKey'] as const;

export type KeyModifierType = (typeof KeyModifierList)[number];
