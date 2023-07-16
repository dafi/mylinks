import React, { ReactNode, useEffect, useState } from 'react';
import Config from '../../common/Config';
import { isEditLinkData, prepareForSave } from '../../common/EditHelper';
import { isKeyboardEventConsumer } from '../../common/HtmlUtil';
import { UIInput } from '../../common/UIInput';
import { AppConfigContextProvider } from '../../contexts/AppConfigContextProvider';

import { AppUIState, AppUIStateContext } from '../../contexts/AppUIStateContext';
import { EditDataType, EditLinkData, EditWidgetData } from '../../model/EditData-interface';
import { MyLinksEvent } from '../../model/Events';
import { openLink } from '../../model/MyLinks';
import { Link, MyLinks as MMLinks } from '../../model/MyLinks-interface';
import { EditLinkDialog } from '../editLinkDialog/EditLinkDialog';
import { LinkFinderDialog } from '../linkFinderDialog/LinkFinderDialog';
import { Grid } from '../widgets/grid/Grid';
import './App.css';
import { getHideShortcuts, toggleHideShortcuts } from './App.utils';
import { AppToolbar, AppToolbarActionType } from './AppToolbar';
import './toolbar-icon.css';

interface LinkDialogData {
  isOpen: boolean;
  data?: EditLinkData;
}

function Page(): JSX.Element {
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

  function showEditLinkDialog(isOpen: boolean, data?: EditLinkData): void {
    if (data?.editType === 'delete') {
      onSave(data);
      return;
    }
    setEditLinkDialog({ isOpen, data });
  }

  function onClickToolbar(e: MyLinksEvent<AppToolbarActionType>): void {
    if (e.target === 'loadConfig') {
      onLoadConfig(e.data as File);
    } else if (e.target === 'shortcut') {
      onShortcut();
    } else if (e.target === 'saveConfig') {
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

  function onEditData(editData: EditDataType): void {
    if (isEditLinkData(editData)) {
      if (editData.editType === 'update' || editData.editType === 'create') {
        showEditLinkDialog(true, editData);
      } else {
        onSave(editData);
      }
    } else {
      onSave(editData);
    }
  }

  function onLoadConfig(file: File): void {
    Config.fromFile(file, (mmLinks: MMLinks | undefined) => {
      setMyLinks(mmLinks);
    });
  }

  function onSave(data: EditLinkData | EditWidgetData): void {
    if (!myLinks) {
      return;
    }
    try {
      if (prepareForSave(data)) {
        Config.saveData(myLinks, (mmLinks) => setMyLinks(mmLinks));
      }
    } catch (e) {
      alert((e as Error).message);
    }
  }

  function renderLinkFinder(): ReactNode {
    if (isFinderOpen) {
      return <LinkFinderDialog isOpen={isFinderOpen}
                               onClose={(): void => setIsFinderOpen(false)}
                               onLinkSelected={onLinkSelected}
                               widgets={myLinks?.columns}/>;
    }
    return null;
  }

  function renderEditLinkDialog(): ReactNode {
    const { isOpen, data } = editLinkDialog;
    if (isOpen && data) {
      return <EditLinkDialog isOpen={isOpen}
                             onSave={onSave}
                             onClose={(): void => showEditLinkDialog(false)}
                             data={data}/>;
    }
    return null;
  }

  const defaultUiState: AppUIState = {
    hideShortcuts: getHideShortcuts(),
    onEdit: onEditData,
  };

  const [myLinks, setMyLinks] = useState<MMLinks>();
  const [uiState, setUiState] = useState(defaultUiState);
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [editLinkDialog, setEditLinkDialog] = useState<LinkDialogData>({ isOpen: false });

  useEffect(() => {
    document.body.addEventListener('keydown', keyDown, false);
    Config.fromData((mmLinks: MMLinks | undefined) => {
      setMyLinks(mmLinks);
    });
    return () => document.body.removeEventListener('keydown', keyDown);
  }, []);

  return <AppConfigContextProvider myLinks={myLinks}>
    <AppUIStateContext.Provider value={uiState}>
      <div className="ml-wrapper">
        <div className="ml-grid">
          <Grid columns={myLinks?.columns || []}/>
        </div>

        <AppToolbar
          action={onClickToolbar}/>

        {renderLinkFinder()}
        {renderEditLinkDialog()}

      </div>
    </AppUIStateContext.Provider>
  </AppConfigContextProvider>;
}

function App(): JSX.Element {
  return <Page/>;
}

export default App;
