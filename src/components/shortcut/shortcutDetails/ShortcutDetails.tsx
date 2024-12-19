import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { KeyCombination } from '../../../model/KeyCombination';
import { Shortcut } from '../Shortcut';
import './ShortcutDetails.css';

type ShortcutDetailsProps = Readonly<{
  label?: string;
  combination: KeyCombination[] | undefined;
}> & ComponentPropsWithoutRef<'div'>;

export function ShortcutDetails(
  {
    label,
    combination,
    children,
    style,
    className = ''
  }: ShortcutDetailsProps
): ReactNode {
  let labelChild;

  if (label != null) {
    labelChild = <label className="shortcut-details-item-label">{label}</label>;
  } else if (children != null) {
    labelChild = <div className="shortcut-details-item-label">{children}</div>;
  }

  return (
    <div className={`shortcut-details-container ${className}`} style={style}>
      {labelChild}
      <div className="shortcut-details-item-key">
        <Shortcut shortcut={combination} visible isMouseOver />
      </div>
    </div>
  );
}
