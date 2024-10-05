// https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086
/**
 * Trigger the func only after the wait timeout
 * @param func the callback called at expire time
 * @param wait the time to wait in millisecond
 * @returns array containing two functions
 * the first must be called from event listener
 * the second could be called to stop programmatically the waiting bound
 */
export const debounce = (func: (...args: unknown[]) => void, wait: number): [(...args: unknown[]) => void, () => void] => {
  let timeout: ReturnType<typeof globalThis.setTimeout>;

  return [
    (...args: unknown[]): void => {
      const later = (): void => {
        func(...args);
      };
      clearTimeout(timeout);
      timeout = globalThis.setTimeout(later, wait);
    },
    (): void => {
      globalThis.clearTimeout(timeout);
    }
  ];
};
