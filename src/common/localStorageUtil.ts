export const getBoolean = (k: string): boolean => (localStorage.getItem(k) === '1') || false;
export const setBoolean = (k: string, v: boolean | null | undefined): void => localStorage.setItem(k, v === true ? '1' : '0');
