import { combinationToString } from '../../components/shortcut/ShortcutUtil';
import { KeyCombination, KeyModifierList, KeyModifierType } from '../../model/KeyCombination';
import { ShortcutList } from '../../model/MyLinks-interface';
import { Shortcut } from './Shortcut';

const shortcuts: Shortcut[] = [];

export type FindShortcutOptions = {
  exactMatch?: boolean;
  compareModifiers?: boolean;
};

type CompareCombinationOptions = Omit<FindShortcutOptions, 'exactMatch'>;

export const getShortcuts = (): Readonly<Shortcut[]> => shortcuts;

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
  c1: Readonly<KeyCombination[]>,
  c2: Readonly<KeyCombination[]>,
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
export function findKeyCombinations<T extends ShortcutList>(
  list: Readonly<T[]>,
  shortcut: Readonly<KeyCombination[]>,
  options?: FindShortcutOptions
): T[] {
  return list.filter(s => compareCombinationsArray(shortcut, s.shortcut, options));
}

export function addShortcut(shortcut: Shortcut): boolean {
  if (shortcut.shortcut.length === 0) {
    console.error(`Shortcut array is empty`, shortcut);
    return false;
  }
  if (findShortcuts(shortcut.shortcut).length > 0) {
    console.error(`Shortcut '${shortcut.shortcut.map(s => combinationToString(s)).join(',')}' already present`);
    return false;
  }
  shortcuts.push(shortcut);
  return true;
}

export function clearShortcuts(): void {
  shortcuts.splice(0);
}
