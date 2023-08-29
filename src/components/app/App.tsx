import { ReactElement, useEffect, useState } from 'react';
import { loadConfig, saveConfig } from '../../common/Config';
import { SystemShortcutManager } from '../../common/SystemShortcutManager';
import { UIInput } from '../../common/UIInput';
import { AppConfigContextProvider } from '../../contexts/AppConfigContextProvider';
import { AppUIState } from '../../contexts/AppUIStateContext';
import { AppUIStateContextProvider } from '../../contexts/AppUIStateContextProvider';
import { EditComplete } from '../../hooks/useEditLink/useEditLink';
import { MyLinksEvent } from '../../model/Events';
import { openLink } from '../../model/MyLinks';
import { Link, MyLinks } from '../../model/MyLinks-interface';
import { AppToolbar } from '../appToolbar/AppToolbar';
import { AppToolbarActionType } from '../appToolbar/AppToolbarButtonTypes';
import { LinkFinderDialog, linkFinderDialogId } from '../linkFinderDialog/LinkFinderDialog';
import { getModal } from '../modal/ModalHandler';
import { CloseResultCode } from '../modal/ModalTypes';
import { settingsDialogId } from '../settingsDialog/SettingsDialog';
import { Grid } from '../widgets/grid/Grid';
import './App.css';
import { getHideShortcuts, toggleHideShortcuts } from './App.utils';

type EditAction = 'editLink' | 'editSettings';

function Page(): ReactElement {
  const onLinkSelected = (link: Link): void => {
    getModal(linkFinderDialogId)?.close(CloseResultCode.Ok);
    // Ensure the DOM is updated and the dialog is hidden when the link is open
    // This is necessary because when returning to myLinks window/tab, the dialog can be yet visible
    window.requestIdleCallback(() => openLink(link));
  };

  function onClickToolbar(e: MyLinksEvent<AppToolbarActionType>): void {
    switch (e.target) {
      case 'loadConfig':
        onLoadConfig(e.data as File);
        break;
      case 'exportConfig':
        onExportConfig();
        break;
      case 'shortcut':
        onShortcut();
        break;
      case 'settingsDialog':
        getModal(settingsDialogId)?.open();
        break;
    }
  }

  function onExportConfig(): void {
    if (myLinks) {
      const indentSpaces = 2;
      const w = window.open();
      w?.document.write(`<pre>${JSON.stringify(myLinks, null, indentSpaces)}</prev>`);
    }
  }

  function onShortcut(): void {
    toggleHideShortcuts();
    setUiState({
      hideShortcuts: getHideShortcuts(),
    });
  }

  function onLoadConfig(file: File): void {
    loadConfig({
      file,
      callback: mmLinks => setMyLinks(mmLinks ? { ...mmLinks } : undefined)
    });
  }

  function onEditComplete(editAction: EditAction, result: EditComplete): void {
    switch (result.type) {
      case 'success': {
        const data = editAction === 'editLink' ? myLinks : result.data as MyLinks;
        if (data) {
          saveConfig({
            data,
            callback: mmLinks => setMyLinks({ ...mmLinks })
          });
        }
        break;
      }
      case 'error':
        alert(result.error.message);
        break;
    }
  }

  const defaultUiState: AppUIState = {
    hideShortcuts: getHideShortcuts(),
  };
  const [myLinks, setMyLinks] = useState<MyLinks>();
  const [uiState, setUiState] = useState(defaultUiState);

  useEffect(() => {
    SystemShortcutManager.instance().add({ shortcut: ' ', callback: () => getModal(linkFinderDialogId)?.open() });
    SystemShortcutManager.instance().add({ shortcut: 'a', callback: () => UIInput.instance().openFromMousePosition() });

    function keyDown(e: KeyboardEvent): boolean {
      return UIInput.instance().keyDown(e);
    }

    document.body.addEventListener('keydown', keyDown, false);
    loadConfig({
      url: new URL(location.href).searchParams.get('c'),
      callback: setMyLinks
    });
    return () => document.body.removeEventListener('keydown', keyDown);
  }, []);

  return (
    <AppConfigContextProvider
      myLinks={myLinks}
      onEditComplete={(result): void => onEditComplete('editSettings', result )}
    >
      <AppUIStateContextProvider
        uiState={uiState}
        onEditComplete={(result): void => onEditComplete('editLink', result )}
      >
        <div className="ml-wrapper">
          <div className="ml-grid">
            <Grid columns={myLinks?.columns ?? []} />
          </div>

          <AppToolbar action={onClickToolbar} />

          <LinkFinderDialog
            onLinkSelected={onLinkSelected}
            widgets={myLinks?.columns}
          />

        </div>
      </AppUIStateContextProvider>
    </AppConfigContextProvider>
  );
}

// Just for App we can declare two components in same file
// eslint-disable-next-line react/no-multi-comp
function App(): ReactElement {
  return <Page />;
}

export default App;
