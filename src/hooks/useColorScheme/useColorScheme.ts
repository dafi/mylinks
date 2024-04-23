import { useEffect } from 'react';
import { applyColorScheme, getColorScheme, SchemeOptions } from '../../common/ColorScheme';

export function useColorScheme(options: Omit<SchemeOptions, 'scheme'>): void {
  useEffect(() => {
    applyColorScheme({ ...options, scheme: getColorScheme() });
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const changeListener = (): void => applyColorScheme({ ...options, scheme: getColorScheme() });
    query.addEventListener('change', changeListener);

    return () => query.removeEventListener('change', changeListener);
    // run only at first render, no matters if options change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
