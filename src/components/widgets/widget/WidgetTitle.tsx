import { KeyboardEvent, ReactNode, useRef } from 'react';
import { isNotEmptyString } from '../../../common/StringUtil';
import { useAppUIStateContext } from '../../../contexts/AppUIStateContext';
import { Widget } from '../../../model/MyLinks-interface';
import { InputText } from '../../inputText/InputText';
import { InputTextHandle } from '../../inputText/InputTextTypes';

type WidgetTitleProps = Readonly<{
  editable: boolean;
  widget: Widget;
  onToggleEdit: () => void;
}>;

export default function WidgetTitle({ editable, widget, onToggleEdit }: WidgetTitleProps): ReactNode {
  function saveTitle(title: string | undefined): void {
    if (context.onEdit && isNotEmptyString(title) && widget.title !== title) {
      context.onEdit({
        widget,
        action: 'update',
        entity: 'widget',
        edited: { title },
        original: { title: widget.title },
      });
    }
  }

  function onKeydownTitle(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Escape') {
      onToggleEdit();
    } else if (e.key === 'Enter') {
      onToggleEdit();
      saveTitle(inputRef.current?.value());
    }
  }

  const context = useAppUIStateContext();
  const inputRef = useRef<InputTextHandle>(null);

  if (editable) {
    return (
      <InputText
        ref={inputRef}
        autoFocus
        className="edit-title"
        defaultValue={widget.title}
        onKeyDown={onKeydownTitle}
        onText={saveTitle}
      />
    );
  }
  return <>{widget.title}</>;
}
