/**
 * Return true if str is a string and characters are not all whitespaces
 * @param str
 * @returns true if a not empty string, false if empty or null or undefined
 */
export function isNotEmptyString(str: string | null | undefined): str is string {
  return str !== undefined && str !== null && str.trim().length > 0;
}

export function toKebab(str: string): string {
  return str.replaceAll(/([A-Z]+)/g, (_, p1: string, pos: number) => (pos === 0 ? '' : '-') + p1.toLowerCase());
}
