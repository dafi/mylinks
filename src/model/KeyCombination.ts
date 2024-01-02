export const KeyModifierList = ['altKey', 'metaKey', 'ctrlKey', 'shiftKey'] as const;

export type KeyModifierType = typeof KeyModifierList[number];

export type KeyCombination = Partial<{ [K in KeyModifierType]: boolean }> & { key: string };
