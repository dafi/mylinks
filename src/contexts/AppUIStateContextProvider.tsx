import React, { ReactNode, useState } from 'react';
import { isEditLinkData, prepareForSave } from '../common/EditHelper';
import { EditLinkDialog } from '../components/editLinkDialog/EditLinkDialog';
import { EditDataType, EditLinkData, EditWidgetData } from '../model/EditData-interface';
import { AppUIState, AppUIStateContext } from './AppUIStateContext';

export interface EditCompleteResult {
  type: 'success' | 'error';
  error?: Error;
}

interface DialogData {
  isOpen: boolean;
  data?: EditLinkData;
}

interface AppUIStateProps {
  uiState: AppUIState;
  onEditComplete: (result: EditCompleteResult) => void;
  children: ReactNode;
}

export function AppUIStateContextProvider(props: AppUIStateProps): JSX.Element {
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

  function onSave(data: EditLinkData | EditWidgetData): void {
    try {
      if (prepareForSave(data)) {
        props.onEditComplete({ type: 'success' });
      }
    } catch (e) {
      props.onEditComplete({ type: 'error', error: e as Error });
    }
  }

  function showEditLinkDialog(isOpen: boolean, data?: EditLinkData): void {
    if (data?.editType === 'delete') {
      onSave(data);
      return;
    }
    setDialogData({ isOpen, data });
  }

  function renderEditLinkDialog(): ReactNode {
    const { isOpen, data } = dialogData;
    if (isOpen && data) {
      return <EditLinkDialog
        isOpen={isOpen}
        onSave={onSave}
        onClose={(): void => showEditLinkDialog(false)}
        data={data}/>;
    }
    return null;
  }

  const [dialogData, setDialogData] = useState<DialogData>({ isOpen: false });
  props.uiState.onEdit = onEditData;

  return <AppUIStateContext.Provider value={props.uiState}>
    {props.children}
    {renderEditLinkDialog()}
  </AppUIStateContext.Provider>;
}
