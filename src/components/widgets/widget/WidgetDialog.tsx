import { FormEvent, ReactNode, useState } from 'react';
import { setPropertyFromDotNotation } from '../../../common/DotNotation';
import { Widget } from '../../../model/MyLinks-interface';
import { ColorPicker, ColorPickerItem } from '../../colorPicker/ColorPicker';
import { Footer, FooterButton } from '../../footer/Footer';
import Modal from '../../modal/Modal';
import { getModal } from '../../modal/ModalHandler';
import { getWidgetColorScheme } from './Widget.utils';

export const widgetDialogId = 'widgetDialogId';

type WidgetDialogProps = Readonly<{
  widget: Widget;
  onSave: (widget: Widget) => void;
}>;

export function WidgetDialog({ widget, onSave }: WidgetDialogProps): ReactNode {
  return (
    <Modal id={widgetDialogId}>
      <div className="panel">
        <header>
          <h2 className="title">{widget.title}</h2>
        </header>

        <WidgetForm widget={widget} onSave={onSave} />
      </div>
    </Modal>
  );
}

// eslint-disable-next-line react/no-multi-comp
function WidgetForm({ widget, onSave }: WidgetDialogProps): ReactNode {
  function onClickSave(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    onSave(form);
    getModal(widgetDialogId).close('Ok');
  }

  function onClickCancel(): void {
    getModal(widgetDialogId).close('Cancel');
  }

  function onChangeColor({ id }: ColorPickerItem, newColor: string): void {
    setForm(setPropertyFromDotNotation(id, newColor, structuredClone(form)));
  }

  const [form, setForm] = useState<Widget>(() => structuredClone(widget));

  const { textColor, backgroundColor } = getWidgetColorScheme(widget);

  const colors: ColorPickerItem[] = [
    { id: 'textColor', label: 'Text', defaultValue: textColor },
    { id: 'backgroundColor', label: 'Background', defaultValue: backgroundColor },
  ];

  const rightButtons: FooterButton[] = [
    { id: 'save', label: 'Save', type: 'submit' },
    { id: 'cancel', label: 'Cancel', onClick: onClickCancel },
  ];

  return (
    <section>
      <form onSubmit={onClickSave}>
        <ul className="form-list">
          <li>
            <label htmlFor="text-color">Colors</label>
            <ColorPicker items={colors} onChange={onChangeColor} />
          </li>
        </ul>
        <Footer rightButtons={rightButtons} />
      </form>
    </section>
  );
}
