import { useEffect } from 'react';
import { loadConfig, OnLoadCallback } from '../../common/Config';
import { CursorPosition } from '../../common/CursorPosition';
import { shortcutListener } from '../../common/shortcut/ShortcutListener';

export function useAppStartup(onLoadCallback: OnLoadCallback): void {
  useEffect(() => {
    CursorPosition.instance().install();
    document.body.addEventListener('keydown', shortcutListener, false);
    loadConfig({
      url: new URL(location.href).searchParams.get('c'),
      callback: onLoadCallback
    });
    return () => {
      CursorPosition.instance().uninstall();
      document.body.removeEventListener('keydown', shortcutListener);
    };
  }, [onLoadCallback]);
}
