import { ReactElement, useState } from 'react';
import { isNotEmptyString } from '../../common/StringUtil';
import Modal from '../modal/Modal';
import './SettingsDialog.css';
import { settingsDialogId, SettingsPanel } from './SettingsDialogTypes';

const PREF_SELECTED_PANEL = 'selectedPanel';

type SettingsDialogProps = Readonly<{
  panels: SettingsPanel[];
  selected?: SettingsPanel;
}>;

export function SettingsDialog(
  settings: SettingsDialogProps
): ReactElement {
  return (
    <Modal id={settingsDialogId}>
      <div>
        <SettingsForm {...settings} />
      </div>
    </Modal>
  );
}

// eslint-disable-next-line react/no-multi-comp
function SettingsForm(
  {
    panels,
    selected,
  }: SettingsDialogProps
): ReactElement {
  const [current, setCurrent] = useState(() => {
    if (selected) {
      return selected;
    }
    const savedPanel = localStorage.getItem(PREF_SELECTED_PANEL);
    return isNotEmptyString(savedPanel) ? panels.find(p => savedPanel === p.title) ?? panels[0] : panels[0];
  });

  function onChangedSelection(panel: SettingsPanel): void {
    localStorage.setItem(PREF_SELECTED_PANEL, panel.title);
    setCurrent(panel);
  }

  return (
    <div className="settings-modal">
      <div className="settings-primary-panel">
        <header>
          <h2 className="title">Settings</h2>
        </header>
        {
          panels.map(p =>
            <div className="group" key={p.title} onClick={(): void => onChangedSelection(p)}>
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
