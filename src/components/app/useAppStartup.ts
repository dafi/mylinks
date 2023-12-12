import { useEffect } from 'react';
import { loadConfig, OnLoadCallback } from '../../common/Config';
import { installCursorPositionTracker, uninstallCursorPositionTracker } from '../../common/CursorPositionTracker';
import { shortcutListener } from '../../common/shortcut/ShortcutListener';

export function useAppStartup(onLoadCallback: OnLoadCallback): void {
  useEffect(() => {
    installCursorPositionTracker();
    document.body.addEventListener('keydown', shortcutListener, false);
    loadConfig({
      url: new URL(location.href).searchParams.get('c'),
      callback: onLoadCallback
    });
    return () => {
      uninstallCursorPositionTracker();
      document.body.removeEventListener('keydown', shortcutListener);
    };
  }, [onLoadCallback]);
}
