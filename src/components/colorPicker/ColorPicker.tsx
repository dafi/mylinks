import { ChangeEvent, ReactNode } from 'react';
import { isNotEmptyString } from '../../common/StringUtil';
import './ColorPicker.css';

export type ColorPickerItem = {
  id: string;
  label?: string;
  defaultValue?: string;
};

type ColorPickerProps = Readonly<{
  items: ColorPickerItem[];
  onChange: (item: ColorPickerItem, newColor: string) => void;
}>;

export function ColorPicker(
  {
    items,
    onChange,
  }: ColorPickerProps
): ReactNode {
  function onChangeColor(item: ColorPickerItem, e: ChangeEvent<HTMLInputElement>): void {
    onChange(item, e.target.value);
  }

  return (
    <div className="color-picker">
      {items.map(item => {
        const { id, label, defaultValue } = item;
        return (
          <div key={id} className="column">
            {isNotEmptyString(label) ? <h2 className="title">{label}</h2> : null}
            <input
              type="color"
              onChange={e => onChangeColor(item, e)}
              defaultValue={defaultValue}
            />
          </div>
        );
      })
      }
    </div>
  );
}
