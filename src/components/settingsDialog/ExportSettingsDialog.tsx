import { ChangeEvent, ReactElement } from 'react';
import { getModal } from '../modal/ModalHandler';

export type ExportConfigType = 'clipboard' | 'view';

interface ExportSettingsProps {
  readonly modalId: string;
  readonly onLoadConfig: (file: File) => void;
  readonly onExportConfig: (type: ExportConfigType) => void;
}

export function ExportSettingsForm(
  {
    modalId,
    onLoadConfig,
    onExportConfig
  }: ExportSettingsProps): ReactElement {
  const onCloseDialog = (): void => {
    getModal(modalId)?.close('Cancel');
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
    <div className="panel">
      <section>
        <form>
          <ul className="form-list">
            <li>
              <label htmlFor="load-config">Load</label>
              <div>
                <label className="form-button text-white bg-action-warn hover">
                  Load JSON
                  {/* eslint-disable-next-line react/jsx-max-depth */}
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
            <li>
              <label htmlFor="load-config">Save</label>
              <div>
                <button
                  type="button"
                  name="export-json"
                  id="export-json"
                  className="form-button text-white bg-action-success hover"
                  onClick={() => onExportConfig('clipboard')}
                >
                  Copy to Clipboard
                </button>
                <button
                  type="button"
                  name="export-json"
                  id="export-json"
                  className="form-button text-white bg-action-success hover"
                  onClick={() => onExportConfig('view')}
                >
                  View JSON
                </button>
              </div>
            </li>
          </ul>
        </form>
      </section>

      <footer className="footer">
        <div className="toolbar">
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
        </div>
      </footer>
    </div>
  );
}
