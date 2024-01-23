import { ReactElement } from 'react';
import { KeyCombination } from '../../../model/KeyCombination';
import { Shortcut } from '../Shortcut';
import './ShortcutDetails.css';

type ShortcutDetailsProps = {
  readonly label?: string;
  readonly combination: KeyCombination[] | undefined;
};

const defaultProps = {
  label: undefined,
};

export function ShortcutDetails({ label, combination }: ShortcutDetailsProps): ReactElement {
  return (
    <div className="shortcut-details-container">
      { label != null && <label className="shortcut-details-item-label">{label}</label> }
      <div className="shortcut-details-item-key">
        <Shortcut shortcut={combination} visible isMouseOver />
      </div>
    </div>
  );
}

ShortcutDetails.defaultProps = defaultProps;
