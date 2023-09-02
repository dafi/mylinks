import { useCallback, useState } from 'react';
import { isLinkEditData, prepareForSave } from '../../common/EditHelper';

import { editLinkDialogId } from '../../components/editLinkDialog/EditLinkDialogTypes';
import { getModal } from '../../components/modal/ModalHandler';
import { EditDataType, LinkEditData } from '../../model/EditData-interface';

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
  linkEditData: LinkEditData;
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
  const [linkEditData, setLinkEditData] = useState<LinkEditData>({
    editType: 'create',
    edited: { label: '', url: '' },
    link: { id: '', label: '', url: '' },
    widget: { id: '', title: '', list: [] }
  });

  const onSave = useCallback((editData: EditDataType): void => {
    try {
      if (prepareForSave(editData)) {
        onEditComplete({ type: 'success', data: editData });
      }
    } catch (e) {
      onEditComplete({ type: 'error', error: e as Error });
    }
  }, [onEditComplete]);

  const onBeginEdit = useCallback((editData: EditDataType): void => {
    if (isLinkEditData(editData)) {
      if (editData.editType === 'update' || editData.editType === 'create') {
        setLinkEditData(editData);
        getModal(editLinkDialogId)?.open();
      } else {
        onSave(editData);
      }
    } else {
      onSave(editData);
    }
  }, [onSave]);

  return { linkEditData, onBeginEdit, onSave };
}
