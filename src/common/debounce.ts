// https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086
export const debounce = (func: (...args: unknown[]) => void, wait: number): (...args: unknown[]) => void => {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: unknown[]): void {
    const later = (): void => {
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

