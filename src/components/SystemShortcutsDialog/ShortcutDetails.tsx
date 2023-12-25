import { ReactElement } from 'react';
import { Shortcut as LinkShortcut } from '../widgets/link/Shortcut';
import './ShortcutDetails.css';

type ShortcutDetailsProps = {
  readonly label: string;
  readonly combination: string;
};

export function ShortcutDetails({ label, combination }: ShortcutDetailsProps): ReactElement {
  return (
    <div className="shortcut-details-container">
      <label className="shortcut-details-item">{label}</label>
      <div className="shortcut-details-item">
        <LinkShortcut shortcut={combination} visible isMouseOver />
      </div>
    </div>
  );
}
