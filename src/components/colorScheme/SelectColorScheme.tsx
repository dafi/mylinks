import { ChangeEvent, ReactNode } from 'react';
import { ColorScheme } from '../../common/ColorScheme';

type SelectColorSchemeProps = {
  readonly colorScheme?: ColorScheme;
  readonly onSelectColorScheme: (scheme: ColorScheme) => void;
};

type SeparatorType = [null, null];
const Separator: SeparatorType = [null, null];

const menuItems = new Array<[ColorScheme, string] | SeparatorType>(
  ['system', 'System'],
  Separator,
  ['light', 'Always Light'],
  ['dark', 'Always Dark'],
);

export function SelectColorScheme(
  {
    colorScheme = 'system',
    onSelectColorScheme
  }: SelectColorSchemeProps
): ReactNode {
  function onChange(e: ChangeEvent<HTMLSelectElement>): void {
    onSelectColorScheme(e.target.value as ColorScheme);
  }

  return (
    <select defaultValue={colorScheme} onChange={onChange}>
      {menuItems.map(([scheme, label], index) =>
        // eslint-disable-next-line react/no-array-index-key
        scheme ? <option key={scheme} value={scheme}>{label}</option> : <hr key={index} />
      )}
    </select>
  );
}
