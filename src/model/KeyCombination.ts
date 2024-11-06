export const KeyModifierList = ['altKey', 'metaKey', 'ctrlKey', 'shiftKey'] as const;

export type KeyModifierType = typeof KeyModifierList[number];

export type KeyCombination = Partial<Record<KeyModifierType, boolean>> & { key: string };

export type HotKey = {
  hotKey: KeyCombination[];
};
