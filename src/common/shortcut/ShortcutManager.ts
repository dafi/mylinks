import { formatShortcuts } from '../../components/shortcut/ShortcutUtil';
import { KeyCombination, KeyModifierList, KeyModifierType } from '../../model/KeyCombination';
import { Shortcut } from './Shortcut';

const shortcuts: Shortcut[] = [];

export type FindShortcutOptions = {
  exactMatch?: boolean;
  compareModifiers?: boolean;
};

type CompareCombinationOptions = Omit<FindShortcutOptions, 'exactMatch'>;

export const getShortcuts = (): readonly Shortcut[] => shortcuts;

export function compareModifiers(
  c1: Readonly<Pick<KeyCombination, KeyModifierType>>,
  c2: Readonly<Pick<KeyCombination, KeyModifierType>>,
): boolean {
  for (const prop of KeyModifierList) {
    const p1 = prop in c1 ? c1[prop] : false;
    const p2 = prop in c2 ? c2[prop] : false;

    if (p1 !== p2) {
      return false;
    }
  }

  return true;
}

export function compareCombinations(
  c1: Readonly<KeyCombination>,
  c2: Readonly<KeyCombination>,
  options?: CompareCombinationOptions
): boolean {
  const modifiersMatch = options && options.compareModifiers === true ? compareModifiers(c1, c2) : true;
  return modifiersMatch && c1.key === c2.key;
}

export function compareCombinationsArray(
  c1: readonly KeyCombination[],
  c2: readonly KeyCombination[],
  options?: FindShortcutOptions
): boolean {
  const userOptions: Required<FindShortcutOptions> = { exactMatch: true, compareModifiers: true, ...options };

  if (c1.length === 0 || c2.length === 0) {
    return false;
  }
  if (userOptions.exactMatch && c1.length !== c2.length) {
    return false;
  }
  for (let i = 0; i < Math.min(c1.length, c2.length); i++) {
    if (!compareCombinations(c1[i], c2[i], userOptions)) {
      return false;
    }
  }
  return true;
}

/**
 * Returns all shortcuts matching {@link shortcut}, the search is done on the global {@link shortcuts} list
 * @param shortcut
 * @param options
 * @returns the matching shortcuts
 */
export const findShortcuts = (shortcut: KeyCombination[], options?: FindShortcutOptions): Shortcut[] =>
  findKeyCombinations(shortcuts, shortcut, options);

/**
 * Returns all shortcuts matching {@link shortcut}, the search is done on {@link list}
 * @param list
 * @param shortcut
 * @param options
 * @returns the matching shortcuts
 */
export function findKeyCombinations<T extends Shortcut>(
  list: readonly T[],
  shortcut: readonly KeyCombination[],
  options?: FindShortcutOptions
): T[] {
  return list.filter(s => compareCombinationsArray(shortcut, s.hotKey, options));
}

/**
 * Check is passed object is a KeyCombination[]
 * @param obj
 * @returns true if obj is an array and contains KeyCombination, an empty array returns true
 */
export function isKeyCombinationArray(obj: unknown): obj is KeyCombination[] {
  return Array.isArray(obj) && (obj.length === 0 ? true : 'key' in obj[0]);
}

export function addShortcut(shortcut: Shortcut): boolean {
  if (shortcut.hotKey.length === 0) {
    console.error(`Shortcut hotkey is empty`, shortcut);
    return false;
  }
  if (findShortcuts(shortcut.hotKey).length > 0) {
    console.error(`Shortcut '${formatShortcuts(shortcut)}' already present`);
    return false;
  }
  shortcuts.push(shortcut);
  return true;
}

export function clearShortcuts(): void {
  shortcuts.splice(0);
}
