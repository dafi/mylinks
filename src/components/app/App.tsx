import { ReactElement, useEffect, useState } from 'react';
import { loadConfig, saveConfig } from '../../common/Config';
import { SystemShortcutManager } from '../../common/SystemShortcutManager';
import { UIInput } from '../../common/UIInput';
import { AppConfigContextProvider } from '../../contexts/AppConfigContextProvider';
import { AppUIState } from '../../contexts/AppUIStateContext';
import { AppUIStateContextProvider, EditCompleteResult } from '../../contexts/AppUIStateContextProvider';
import { MyLinksEvent } from '../../model/Events';
import { openLink } from '../../model/MyLinks';
import { Link, MyLinks as MMLinks } from '../../model/MyLinks-interface';
import { AppToolbarActionType } from '../appToolbar/AppToolbarButtonTypes';
import { LinkFinderDialog, linkFinderDialogId } from '../linkFinderDialog/LinkFinderDialog';
import { getModal } from '../modal/ModalHandler';
import { Grid } from '../widgets/grid/Grid';
import './App.css';
import { AppToolbar } from '../appToolbar/AppToolbar';
import { getHideShortcuts, toggleHideShortcuts } from './App.utils';

function Page(): ReactElement {
  const onLinkSelected = (link: Link): void => {
    getModal(linkFinderDialogId)?.close();
    // Ensure the DOM is updated and the dialog is hidden when the link is open
    // This is necessary because when returning to myLinks window/tab, the dialog can be yet visible
    window.requestIdleCallback(() => openLink(link));
  };

  function onClickToolbar(e: MyLinksEvent<AppToolbarActionType>): void {
    if (e.target === 'loadConfig') {
      onLoadConfig(e.data as File);
    } else if (e.target === 'shortcut') {
      onShortcut();
    } else {
      onSaveConfig();
    }
  }

  function onSaveConfig(): void {
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

  function onEditComplete(result: EditCompleteResult): void {
    switch (result.type) {
      case 'success':
        if (myLinks) {
          saveConfig({
            data: myLinks,
            callback: mmLinks => setMyLinks({ ...mmLinks })
          });
        }
        break;
      case 'error':
        if (result.error) {
          alert(result.error.message);
        }
        break;
    }
  }

  const defaultUiState: AppUIState = {
    hideShortcuts: getHideShortcuts(),
  };

  const [myLinks, setMyLinks] = useState<MMLinks>();
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
    <AppConfigContextProvider myLinks={myLinks}>
      <AppUIStateContextProvider
        uiState={uiState}
        onEditComplete={onEditComplete}
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
