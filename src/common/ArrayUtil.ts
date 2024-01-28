/**
 * Move element from position `from` to position `to`
 * @param arr the array
 * @param from the from position
 * @param to the to position
 * @returns a new array where the element has changed position
 */
export function move<T>(arr: T[], from: number, to: number): T[] {
  // toSpliced() not yet available
  // so, we make a copy using the spread operator
  const clone = [...arr];
  if (from === to) {
    return clone;
  }
  const [el] = clone.splice(from, 1);
  if (to > from) {
    --to;
  }
  clone.splice(to, 0, el);
  return clone;
}

export function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.length > 0 && typeof v[0] === 'string';
}
