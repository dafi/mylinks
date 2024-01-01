import { ReactElement } from 'react';
import { KeyCombination } from '../../model/KeyCombination';
import { Shortcut } from './Shortcut';
import './ShortcutDetails.css';

type ShortcutDetailsProps = {
  readonly label: string;
  readonly combination: KeyCombination[];
};

export function ShortcutDetails({ label, combination }: ShortcutDetailsProps): ReactElement {
  return (
    <div className="shortcut-details-container">
      <label className="shortcut-details-item">{label}</label>
      <div className="shortcut-details-item">
        <Shortcut shortcut={combination} visible isMouseOver />
      </div>
    </div>
  );
}
