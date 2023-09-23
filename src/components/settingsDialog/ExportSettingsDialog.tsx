import { ChangeEvent, ReactElement } from 'react';
import { getModal } from '../modal/ModalHandler';
import { CloseResultCode } from '../modal/ModalTypes';

interface ExportSettingsProps {
  readonly modalId: string;
  readonly onLoadConfig: (file: File) => void;
  readonly onExportConfig: () => void;
}

export function ExportSettingsForm(
  {
    modalId,
    onLoadConfig,
    onExportConfig
  }: ExportSettingsProps): ReactElement {
  const onCloseDialog = (): void => {
    getModal(modalId)?.close(CloseResultCode.Cancel);
  };

  function handleFileSelect(evt: ChangeEvent<HTMLInputElement>): void {
    const file = evt.target.files?.[0] ?? null;
    // onChange is not called when the path is the same so, we force the change
    evt.target.value = '';
    if (file) {
      onLoadConfig(file);
    }
  }

  return (
    <form>
      <ul className="flex-outer">
        <li className="toolbar">
          <label htmlFor="load-config">Load</label>
          <div className="toolbar-left">
            <label className="form-button text-white bg-action-primary hover">
              JSON
              <input
                type="file"
                name="load-config"
                id="load-config"
                className="input-file"
                accept="application/json"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        </li>
        <li className="toolbar">
          <label htmlFor="export-json">Export</label>
          <div className="toolbar-left">
            <button
              type="button"
              name="export-json"
              id="export-json"
              className="text-white bg-action-primary hover"
              onClick={onExportConfig}
            >
              JSON
            </button>
          </div>
        </li>
        <li className="toolbar">
          <div className="toolbar-left" />
          <div className="toolbar-right">
            <button
              type="button"
              className="text-white bg-action-secondary hover right"
              onClick={onCloseDialog}
            >
              Close
            </button>
          </div>
        </li>
      </ul>
    </form>
  );
}
