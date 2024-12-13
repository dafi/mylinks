import { ChangeEvent, ReactElement } from 'react';
import { isNotEmptyString } from '../../common/StringUtil';
import './ColorPicker.css';

export type ColorItem = {
  id: string;
  label?: string;
  defaultValue?: string;
};

type ColorPickerProps = Readonly<{
  items: ColorItem[];
  onChange: (item: ColorItem, newColor: string) => void;
}>;

export function ColorPicker({ items, onChange }: ColorPickerProps): ReactElement {
  function onChangeColor(e: ChangeEvent<HTMLInputElement>, index: number): void {
    onChange(items[index], e.target.value);
  }

  return (
    <div className="color-picker">
      {items.map(({ label, defaultValue }, index) => {
        const title = isNotEmptyString(label) ? <h2 className="title">{label}</h2> : null;

        return (
          <div key={label} className="column">
            {title}
            <input
              type="color"
              onChange={e => onChangeColor(e, index)}
              defaultValue={defaultValue}
            />
          </div>
        );
      })
      }
    </div>
  );
}
