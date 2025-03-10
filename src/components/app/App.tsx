import { ReactNode } from 'react';
import { executeAction } from '../../action/Action';
import { buildColorSchemeOptions } from '../../common/ColorScheme';
import { loadConfig, saveConfig } from '../../common/Config';
import { createAppConfig } from '../../contexts/AppConfig';
import { AppConfigContextProvider } from '../../contexts/AppConfigContextProvider';
import { AppUIStateContextProvider } from '../../contexts/AppUIStateContextProvider';
import { useAppConfig } from '../../contexts/useAppConfig';
import { useAppUIState } from '../../contexts/useAppUIState';
import { useColorScheme } from '../../hooks/useColorScheme/useColorScheme';
import { EditComplete } from '../../hooks/useEditLink/useEditLink';
import { MyLinksEvent } from '../../model/Events';
import { openLink } from '../../model/MyLinks';
import { Link, MyLinks } from '../../model/MyLinks-interface';
import { AppToolbar } from '../appToolbar/AppToolbar';
import { AppToolbarActionType } from '../appToolbar/AppToolbarButtonTypes';
import { ErrorBox } from '../errorBox/ErrorBox';
import { LinkFinderDialog } from '../linkFinderDialog/LinkFinderDialog';
import { linkFinderDialogId } from '../linkFinderDialog/LinkFinderDialogTypes';
import { getModal } from '../modal/ModalHandler';
import { ReminderComponent } from '../reminder/Reminder';
import { ExportConfigType } from '../settingsDialog/ExportSettingsDialog';
import { StickyBox } from '../stickyBox/StickyBox';
import { Grid } from '../widgets/grid/Grid';
import './App.css';
import { useAppStartup } from './useAppStartup';

type EditAction = 'editLink' | 'editSettings';

function Page(): ReactNode {
  const onLinkSelected = (link: Link): void => {
    getModal(linkFinderDialogId).close('Ok');
    // Ensure the DOM is updated and the dialog is hidden when the link is open
    // This is necessary because when returning to myLinks window/tab, the dialog can be yet visible
    window.requestIdleCallback(() => openLink(link));
  };

  function onClickToolbar(e: MyLinksEvent<AppToolbarActionType>): void {
    switch (e.target) {
      case 'loadConfig':
        onLoadConfig(e.data as File);
        break;
      case 'toggleShortcuts':
        executeAction('toggleShortcuts');
        break;
      case 'findLinks':
        executeAction('findLinks');
        break;
      case 'openSettings':
        executeAction('openSettings');
        break;
      case 'addWidget':
        executeAction('addWidget');
        break;
      case 'expandAllWidgets':
        executeAction('expandAllWidgets');
        break;
      case 'collapseAllWidgets':
        executeAction('collapseAllWidgets');
        break;
    }
  }

  function onExportConfig(type: ExportConfigType = 'view'): void {
    executeAction('exportConfig', type);
  }

  function onLoadConfig(file: File): void {
    loadConfig({
      source: file,
      callback: {
        onLoad: mmLinks => {
          setConfig(createAppConfig(mmLinks, updateUIState));
          updateUIState({ type: 'settingsChanged', value: false });
          updateUIState({ type: 'configurationLoaded' });
        },
        onError: error => updateUIState({ type: 'error', error })
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
            setConfig(createAppConfig(mmLinks, updateUIState));
            updateUIState({ type: 'settingsChanged', value: true });
          }
        });
        break;
      }
      case 'error':
        updateUIState({ type: 'error', error: result.error });
        break;
    }
  }

  const [uiState, updateUIState] = useAppUIState();
  const [config, setConfig, onConfigLoaded] = useAppConfig(updateUIState);

  useAppStartup(onConfigLoaded);
  useColorScheme(buildColorSchemeOptions({
    colorScheme: config.theme?.colorScheme ?? 'system',
  }));

  const myLinks = config.myLinksLookup.myLinks;
  const links = myLinks.columns.flat().flatMap(w => w.list);
  return (
    <AppConfigContextProvider
      config={config}
      onEditComplete={(result): void => onEditComplete('editSettings', result)}
      onLoadConfig={onLoadConfig}
      onExportConfig={onExportConfig}
    >
      <AppUIStateContextProvider
        uiState={uiState}
        onEditComplete={(result): void => onEditComplete('editLink', result)}
      >
        <>
          <StickyBox>
            {uiState.error !== undefined &&
              <ErrorBox error={uiState.error} />
            }
            <ReminderComponent
              message="Widgets modified but not yet saved"
              isVisible={uiState.settingsChanged}
              onExportConfig={onExportConfig}
            />
          </StickyBox>

          <div className="ml-wrapper">
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
        </>
      </AppUIStateContextProvider>
    </AppConfigContextProvider>
  );
}

// Just for App we can declare two components in same file
// eslint-disable-next-line react/no-multi-comp
function App(): ReactNode {
  return <Page />;
}

export default App;
