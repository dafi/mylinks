import { useCallback, useState } from 'react';
import { isEditLinkData, prepareForSave } from '../../common/EditHelper';
import { editLinkDialogId } from '../../components/editLinkDialog/EditLinkDialog';
import { getModal } from '../../components/modal/ModalHandler';
import { EditDataType, EditLinkData, EditWidgetData } from '../../model/EditData-interface';

export interface EditCompleteSuccess {
  type: 'success';
  data?: unknown;
}

export interface EditCompleteError {
  type: 'error';
  error: Error;
}

export type EditComplete = EditCompleteSuccess | EditCompleteError;

interface UseEditLink {
  editLinkData: EditLinkData;
  /**
   * Begin the edit operation then save edited data, this can require to show a dialog or immediately call save
   * @param editData the data to edit/save
   */
  onBeginEdit: (editData: EditDataType) => void;
  onSave: (data: EditDataType) => void;
}

/**
 * Provides a state to edit Link properties, if required the editing operations can show UI (dialogs, prompts)
 * or immediately call save
 * @param onEditComplete the callback called when edit is completed, mainly after save the properties
 * @returns the UseEditLink object
 */
export function useEditLink(onEditComplete: (result: EditComplete) => void): UseEditLink {
  const [editLinkData, setEditLinkData] = useState<EditLinkData>({
    editType: 'create',
    link: { id: '', label: '', url: '' },
    widget: { id: '', title: '', list: [] }
  });

  const onSave = useCallback((editedData: EditLinkData | EditWidgetData): void => {
    try {
      if (prepareForSave(editedData)) {
        onEditComplete({ type: 'success' });
      }
    } catch (e) {
      onEditComplete({ type: 'error', error: e as Error });
    }
  }, [onEditComplete]);

  const onBeginEdit = useCallback((editData: EditDataType): void => {
    if (isEditLinkData(editData)) {
      if (editData.editType === 'update' || editData.editType === 'create') {
        setEditLinkData(editData);
        getModal(editLinkDialogId)?.open();
      } else {
        onSave(editData);
      }
    } else {
      onSave(editData);
    }
  }, [onSave]);

  return { editLinkData, onBeginEdit, onSave };
}
