import { KeyboardEvent, ReactNode, useRef } from 'react';
import { isNotEmptyString } from '../../../common/StringUtil';
import { useAppUIStateContext } from '../../../contexts/AppUIStateContext';
import { InputText } from '../../inputText/InputText';
import { InputTextHandle } from '../../inputText/InputTextTypes';
import { useWidgetContext } from '../contexts/WidgetContext';

type WidgetTitleProps = Readonly<{
  onToggleEdit: () => void;
}>;

export default function WidgetTitle({ onToggleEdit }: WidgetTitleProps): ReactNode {
  function saveTitle(title: string | undefined): void {
    if (onEdit && isNotEmptyString(title) && widget.title !== title) {
      onEdit({
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

  const { onEdit } = useAppUIStateContext();
  const { widget, editable } = useWidgetContext();
  const inputRef = useRef<InputTextHandle | null>(null);

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
