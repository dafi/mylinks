import { ReactElement, useCallback, useState } from 'react';
import { loadConfig, saveConfig } from '../../common/Config';
import { createWidget } from '../../common/MyLinksUtil';
import { defaultTheme } from '../../common/ThemeUtil';
import { AppConfigContextProvider } from '../../contexts/AppConfigContextProvider';
import { AppUIStateContextProvider } from '../../contexts/AppUIStateContextProvider';
import { useAppUIState } from '../../contexts/useAppUIState';
import { EditComplete } from '../../hooks/useEditLink/useEditLink';
import { EditDataType } from '../../model/EditData-interface';
import { MyLinksEvent } from '../../model/Events';
import { openLink } from '../../model/MyLinks';
import { Link, MyLinks } from '../../model/MyLinks-interface';
import { MyLinksLookup } from '../../model/MyLinksLookup';
import { AppToolbar } from '../appToolbar/AppToolbar';
import { AppToolbarActionType } from '../appToolbar/AppToolbarButtonTypes';
import { LinkFinderDialog } from '../linkFinderDialog/LinkFinderDialog';
import { linkFinderDialogId } from '../linkFinderDialog/LinkFinderDialogTypes';
import { getModal } from '../modal/ModalHandler';
import { CloseResultCode } from '../modal/ModalTypes';
import { ReminderComponent } from '../reminder/Reminder';
import { settingsDialogId } from '../settingsDialog/SettingsDialogTypes';
import { Grid } from '../widgets/grid/Grid';
import './App.css';
import { useAppStartup } from './useAppStartup';

type EditAction = 'editLink' | 'editSettings';

type WidgetToolbarData = {
  onEdit?: (editData: EditDataType) => void;
  myLinksLookup?: MyLinksLookup;
};

const defaultMyLinks: MyLinks = {
  theme: defaultTheme,
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
        onAddWidget(e.data as WidgetToolbarData);
    }
  }

  function onAddWidget(data: WidgetToolbarData): void {
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

  function onExportConfig(): void {
    const indentSpaces = 2;
    const w = window.open();
    w?.document.write(`<pre>${JSON.stringify(myLinks, null, indentSpaces)}</prev>`);
    updateUIState({ type: 'settingsChanged', value: false });
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
            <Grid columns={myLinks.columns} />
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
