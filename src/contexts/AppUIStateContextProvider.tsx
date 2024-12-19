import { ReactNode, useEffect } from 'react';
import { EditLinkDialog } from '../components/editLinkDialog/EditLinkDialog';
import { editLinkDialogId } from '../components/editLinkDialog/EditLinkDialogTypes';
import { getModal } from '../components/modal/ModalHandler';
import { EditComplete, useEditLink } from '../hooks/useEditLink/useEditLink';
import { AppUIState, AppUIStateContext } from './AppUIStateContext';

type AppUIStateProps = Readonly<{
  uiState: AppUIState;
  onEditComplete: (result: EditComplete) => void;
  children: ReactNode;
}>;

export function AppUIStateContextProvider(
  {
    uiState,
    onEditComplete,
    children,
  }: AppUIStateProps
): ReactNode {
  const { onBeginEdit, onSave, linkEditData } = useEditLink(onEditComplete);
  const localUIState = { ... uiState, onEdit: onBeginEdit };

  useEffect(() => {
    if (linkEditData) {
      getModal(editLinkDialogId)?.open();
    }
  }, [linkEditData]);

  return (
    <AppUIStateContext.Provider value={localUIState}>
      {children}
      { linkEditData && (linkEditData.action === 'create' || linkEditData.action === 'update') &&
        <EditLinkDialog
          onSave={onSave}
          data={linkEditData}
        />
      }
    </AppUIStateContext.Provider>
  );
}
