import React, { useRef } from 'react';
import { useAppUIStateContext } from '../../../contexts/AppUIStateContext';
import { Widget } from '../../../model/MyLinks-interface';
import { InputText, InputTextHandle } from '../../inputText/InputText';

interface WidgetTitleProps {
  editable: boolean;
  widget: Widget;
  onToggleEdit: () => void;
}

export default function WidgetTitle({ editable, widget, onToggleEdit }: WidgetTitleProps): JSX.Element {
  function saveTitle(title: string | undefined): void {
    if (context.onEdit && title && widget.title !== title) {
      context.onEdit({
        widget,
        editType: 'update',
        editedProperties: { title }
      });
    }
  }

  function onKeydownTitle(e: React.KeyboardEvent<HTMLInputElement>): void {
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
  // it's necessary to compile, JSX.Element can't be a literal
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{widget.title}</>;
}
