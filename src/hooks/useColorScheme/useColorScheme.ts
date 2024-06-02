import { useEffect } from 'react';
import { applyColorScheme, SchemeOptions } from '../../common/ColorScheme';

export function useColorScheme(options: SchemeOptions): void {
  useEffect(() => {
    const changeListener = (): void => applyColorScheme(options);
    changeListener();
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    query.addEventListener('change', changeListener);

    return (): void => query.removeEventListener('change', changeListener);
  }, [options]);
}
