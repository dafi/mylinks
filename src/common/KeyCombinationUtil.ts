import { KeyCombination } from '../model/KeyCombination';

export function isKeyCombinationArray(v: unknown): v is KeyCombination[] {
  return Array.isArray(v) && v.length > 0 && typeof v[0] === 'object' && 'key' in v[0];
}

