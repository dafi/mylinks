import { ReactElement, useCallback, useState } from 'react';
import { loadConfig, saveConfig } from '../../common/Config';
import { createWidget } from '../../common/MyLinksUtil';
import { AppConfigContextProvider } from '../../contexts/AppConfigContextProvider';
import { AppUIStateContextProvider } from '../../contexts/AppUIStateContextProvider';
import { useAppUIState } from '../../contexts/useAppUIState';
import { useColorScheme } from '../../hooks/useColorScheme/useColorScheme';
import { EditComplete } from '../../hooks/useEditLink/useEditLink';
import { MyLinksEvent } from '../../model/Events';
import { openLink } from '../../model/MyLinks';
import { Link, MyLinks } from '../../model/MyLinks-interface';
import { AppToolbar } from '../appToolbar/AppToolbar';
import { AppToolbarActionType } from '../appToolbar/AppToolbarButtonTypes';
import { AppToolbarAddWidgetData } from '../appToolbar/AppToolbarDataTypes';
import { LinkFinderDialog } from '../linkFinderDialog/LinkFinderDialog';
import { linkFinderDialogId } from '../linkFinderDialog/LinkFinderDialogTypes';
import { getModal } from '../modal/ModalHandler';
import { CloseResultCode } from '../modal/ModalTypes';
import { ReminderComponent } from '../reminder/Reminder';
import { ExportConfigType } from '../settingsDialog/ExportSettingsDialog';
import { settingsDialogId } from '../settingsDialog/SettingsDialogTypes';
import { Grid } from '../widgets/grid/Grid';
import './App.css';
import { useAppStartup } from './useAppStartup';

type EditAction = 'editLink' | 'editSettings';

const defaultMyLinks: MyLinks = {
  columns: []
};

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
      case 'shortcut':
        onShortcut();
        break;
      case 'searchLink':
        getModal(linkFinderDialogId)?.open();
        break;
      case 'settingsDialog':
        getModal(settingsDialogId)?.open();
        break;
      case 'addWidget':
        onAddWidget(e.data as AppToolbarAddWidgetData);
    }
  }

  function onAddWidget(data: AppToolbarAddWidgetData): void {
    const { onEdit, myLinksLookup } = data;
    if (onEdit && myLinksLookup) {
      onEdit({
        action: 'create',
        entity: 'widget',
        edited: createWidget(),
        myLinksLookup
      });
    }
  }

  function onExportConfig(type: ExportConfigType = 'view'): void {
    const indentSpaces = 2;
    if (type === 'clipboard') {
      navigator.clipboard
        .writeText(JSON.stringify(myLinks, null, indentSpaces))
        .then(() => {
          updateUIState({ type: 'settingsChanged', value: false });
        })
        .catch((e: unknown) => {
          window.alert(e);
        });
    } else {
      const w = window.open();
      w?.document.write(`<pre>${JSON.stringify(myLinks, null, indentSpaces)}</prev>`);
      updateUIState({ type: 'settingsChanged', value: false });
    }
  }

  function onShortcut(): void {
    updateUIState({ type: 'hideShortcuts', value: 'toggle' });
  }

  function onLoadConfig(file: File): void {
    loadConfig({
      file,
      callback: mmLinks => {
        if (mmLinks) {
          setMyLinks({ ...mmLinks });
          updateUIState({ type: 'settingsChanged', value: false });
          updateUIState({ type: 'configurationLoaded' });
        }
      }
    });
  }

  function onEditComplete(editAction: EditAction, result: EditComplete): void {
    switch (result.type) {
      case 'success': {
        const data = editAction === 'editLink' ? myLinks : result.data as MyLinks;
        saveConfig({
          data,
          callback: mmLinks => {
            updateUIState({ type: 'settingsChanged', value: true });
            setMyLinks({ ...mmLinks });
          }
        });
        break;
      }
      case 'error':
        alert(result.error.message);
        break;
    }
  }

  const [myLinks, setMyLinks] = useState<MyLinks>(defaultMyLinks);
  const [uiState, updateUIState] = useAppUIState();

  const onConfigurationLoaded = useCallback((m: MyLinks | undefined) => {
    if (m) {
      setMyLinks(m);
    }
  }, [setMyLinks]);
  useAppStartup(onConfigurationLoaded);
  useColorScheme({
    element: document.body,
    cssClass: 'theme-dark'
  });

  const links = myLinks.columns.flat().flatMap(w => w.list);
  return (
    <AppConfigContextProvider
      myLinks={myLinks}
      updateUIState={updateUIState}
      onEditComplete={(result): void => onEditComplete('editSettings', result)}
      onLoadConfig={onLoadConfig}
      onExportConfig={onExportConfig}
    >
      <AppUIStateContextProvider
        uiState={uiState}
        onEditComplete={(result): void => onEditComplete('editLink', result)}
      >
        <div className="ml-wrapper">
          <ReminderComponent
            message="Widgets modified but not yet saved"
            isVisible={uiState.settingsChanged}
            onExportConfig={onExportConfig}
          />
          <div className="ml-grid">
            <Grid key={uiState.reloadCounter} columns={myLinks.columns} />
          </div>

          <AppToolbar action={onClickToolbar} />

          {links.length > 0 &&
            <LinkFinderDialog
              onLinkSelected={onLinkSelected}
              links={links}
            />
          }

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
