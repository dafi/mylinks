import { ReactElement, useEffect, useState } from 'react';
import { loadConfig, saveConfig } from '../../common/Config';
import { isKeyboardEventConsumer } from '../../common/HtmlUtil';
import { UIInput } from '../../common/UIInput';
import { AppConfigContextProvider } from '../../contexts/AppConfigContextProvider';
import { AppUIState } from '../../contexts/AppUIStateContext';
import { AppUIStateContextProvider, EditCompleteResult } from '../../contexts/AppUIStateContextProvider';
import { MyLinksEvent } from '../../model/Events';
import { openLink } from '../../model/MyLinks';
import { Link, MyLinks as MMLinks } from '../../model/MyLinks-interface';
import { LinkFinderDialog } from '../linkFinderDialog/LinkFinderDialog';
import { Grid } from '../widgets/grid/Grid';
import './App.css';
import { getHideShortcuts, toggleHideShortcuts } from './App.utils';
import { AppToolbar, AppToolbarActionType } from './AppToolbar';
import './toolbar-icon.css';

function Page(): ReactElement {
  function keyDown(e: KeyboardEvent): boolean {
    const isThisTarget = e.currentTarget === e.target || !isKeyboardEventConsumer(e.target as HTMLElement);

    // ignore events bubbling from other listeners
    if (!isThisTarget) {
      return true;
    }

    if (e.key === ' ') {
      e.stopPropagation();
      e.preventDefault();

      setIsFinderOpen(true);
      return true;
    }
    return UIInput.instance().keyDown(e);
  }

  const onLinkSelected = (link: Link): void => {
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
      callback: (mmLinks: MMLinks | undefined) => {
        setMyLinks(mmLinks ? { ...mmLinks } : undefined);
      }
    });
  }

  function onEditComplete(result: EditCompleteResult): void {
    switch (result.type) {
      case 'success':
        if (myLinks) {
          saveConfig({
            data: myLinks,
            callback: (mmLinks) => {
              setMyLinks({ ...mmLinks });
            }
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
  const [isFinderOpen, setIsFinderOpen] = useState(false);

  useEffect(() => {
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
            isOpen={isFinderOpen}
            onClose={(): void => setIsFinderOpen(false)}
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
