import { ChangeEvent, ReactNode } from 'react';
import { applyColorScheme, ColorScheme, getColorScheme, setColorScheme } from '../../common/ColorScheme';

type SeparatorType = [null, null];
const Separator: SeparatorType = [null, null];

const menuItems = new Array<[ColorScheme, string] | SeparatorType>(
  ['system', 'System'],
  Separator,
  ['light', 'Always Light'],
  ['dark', 'Always Dark'],
);

function onChange(e: ChangeEvent<HTMLSelectElement>): void {
  const scheme = e.target.value as ColorScheme;
  setColorScheme(scheme);
  applyColorScheme({
    scheme,
    element: document.body,
    cssClass: 'theme-dark'
  });
}

export function SelectColorScheme(): ReactNode {
  return (
    <select defaultValue={getColorScheme()} onChange={onChange}>
      {menuItems.map(([scheme, label], index) =>
        // eslint-disable-next-line react/no-array-index-key
        scheme ? <option key={scheme} value={scheme}>{label}</option> : <hr key={index} />
      )}
    </select>
  );
}
