import { ReactElement } from 'react';
import { EditLinkDialog } from '../components/editLinkDialog/EditLinkDialog';
import { EditComplete, useEditLink } from '../hooks/useEditLink/useEditLink';
import { AppUIState, AppUIStateContext } from './AppUIStateContext';

interface AppUIStateProps {
  readonly uiState: AppUIState;
  readonly onEditComplete: (result: EditComplete) => void;
  readonly children: ReactElement;
}

export function AppUIStateContextProvider(
  {
    uiState,
    onEditComplete,
    children,
  }: AppUIStateProps
): ReactElement {
  const { onBeginEdit, onSave, linkEditData } = useEditLink(onEditComplete);
  uiState.onEdit = onBeginEdit;

  return (
    <AppUIStateContext.Provider value={uiState}>
      {children}

      <EditLinkDialog
        onSave={onSave}
        data={linkEditData}
      />

    </AppUIStateContext.Provider>
  );
}
