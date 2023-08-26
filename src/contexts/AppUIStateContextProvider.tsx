import { ReactElement, useState } from 'react';
import { isEditLinkData, prepareForSave } from '../common/EditHelper';
import { EditLinkDialog, editLinkDialogId } from '../components/editLinkDialog/EditLinkDialog';
import { getModal } from '../components/modal/ModalHandler';
import { EditDataType, EditLinkData, EditWidgetData } from '../model/EditData-interface';
import { AppUIState, AppUIStateContext } from './AppUIStateContext';

export interface EditCompleteResult {
  type: 'success' | 'error';
  error?: Error;
}

interface AppUIStateProps {
  readonly uiState: AppUIState;
  readonly onEditComplete: (result: EditCompleteResult) => void;
  readonly children: ReactElement;
}

export function AppUIStateContextProvider(
  {
    uiState,
    onEditComplete,
    children,
  }: AppUIStateProps
): ReactElement {
  /**
   * Begin the edit operation, this can require to show a dialog or immediately save
   * @param editData the data to edit or save
   */
  function onEditData(editData: EditDataType): void {
    if (isEditLinkData(editData)) {
      if (editData.editType === 'update' || editData.editType === 'create') {
        setDialogData(editData);
        getModal(editLinkDialogId)?.open();
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
        onEditComplete({ type: 'success' });
      }
    } catch (e) {
      onEditComplete({ type: 'error', error: e as Error });
    }
  }

  const [dialogData, setDialogData] = useState<EditLinkData>();
  uiState.onEdit = onEditData;

  return (
    <AppUIStateContext.Provider value={uiState}>
      {children}

      <EditLinkDialog
        onSave={onSave}
        data={dialogData}
      />

    </AppUIStateContext.Provider>
  );
}
