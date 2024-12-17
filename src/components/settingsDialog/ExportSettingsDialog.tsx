import { ChangeEvent, ReactElement } from 'react';
import { Button } from '../button/Button';
import { Footer, FooterButton } from '../footer/Footer';
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

  const rightButtons: FooterButton[] = [
    { id: 'close', label: 'Close', onClick: onCloseDialog, isPrimary: false },
  ];

  return (
    <div className="panel">
      <section>
        <form>
          <ul className="form-list">
            <li>
              <label htmlFor="load-config">Load</label>
              <div>
                <label className="ml-button text-white bg-action-warn hover">
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
                <Button
                  label="Copy to Clipboard"
                  scope="success"
                  onClick={() => onExportConfig('clipboard')}
                />
                <Button
                  label="View JSON"
                  scope="success"
                  onClick={() => onExportConfig('view')}
                />
              </div>
            </li>
          </ul>
        </form>
      </section>

      <Footer rightButtons={rightButtons} />
    </div>
  );
}
