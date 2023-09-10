import { ReactElement, useState } from 'react';
import Modal from '../modal/Modal';
import './SettingsDialog.css';
import { settingsDialogId, SettingsPanel } from './SettingsDialogTypes';

interface SettingsDialogProps {
  readonly panels: SettingsPanel[];
  readonly selected: string;
}

export function SettingsDialog(
  {
    panels,
    selected
  }: SettingsDialogProps
): ReactElement {
  return (
    <Modal id={settingsDialogId}>
      <div>
        <SettingsForm panels={panels} selected={selected} />
      </div>
    </Modal>
  );
}

// eslint-disable-next-line react/no-multi-comp
function SettingsForm(
  {
    panels,
    selected
  }: SettingsDialogProps
): ReactElement {
  const initialSelected = panels.find(p => p.title === selected) ?? panels[0];
  const [current, setCurrent] = useState(initialSelected);

  return (
    <div className="settings-modal">
      <div className="settings-primary-panel">
        <header>
          <h2 className="title">Settings</h2>
        </header>
        {
          panels.map(p =>
            <div className="group" key={p.title} onClick={(): void => setCurrent(p)}>
              <a className={current.title === p.title ? 'selected' : undefined}>
                <h4 className="title">{p.title}</h4>
              </a>
            </div>
          )
        }
      </div>
      <div className="settings-secondary-panel">
        <header>
          <h2 className="title">{current.title}</h2>
          { current.content }
        </header>
      </div>
    </div>
  );
}
