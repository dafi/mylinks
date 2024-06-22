import { useEffect } from 'react';
import { loadConfig, OnLoadCallback } from '../../common/Config';
import { installCursorPositionTracker, uninstallCursorPositionTracker } from '../../common/CursorPositionTracker';
import { shortcutListener } from '../../common/shortcut/ShortcutListener';

export function useAppStartup(onLoadCallback: OnLoadCallback): void {
  useEffect(() => {
    installCursorPositionTracker();
    document.body.addEventListener('keydown', shortcutListener, false);
    try {
      const stringUrl = new URL(location.href).searchParams.get('c') ?? '';
      loadConfig({
        source: stringUrl.length > 0 ? new URL(stringUrl) : undefined,
        callback: onLoadCallback
      });
    } catch (e) {
      onLoadCallback.onError(e);
    }
    return (): void => {
      uninstallCursorPositionTracker();
      document.body.removeEventListener('keydown', shortcutListener);
    };
  }, [onLoadCallback]);
}
