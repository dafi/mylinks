import React, { useContext, useRef } from 'react';
import { AppUIStateContext } from '../../../contexts/AppUIStateContext';
import { Widget } from '../../../model/MyLinks-interface';
import { InputText, InputTextHandle } from '../../inputText/InputText';

const debounceTimeout = 1500;

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

  const context = useContext(AppUIStateContext);
  const inputRef = useRef<InputTextHandle>(null);

  if (editable) {
    return <InputText
      ref={inputRef}
      autoFocus={true}
      className="edit-title"
      debounceTimeout={debounceTimeout}
      defaultValue={widget.title}
      onKeyDown={onKeydownTitle}
      onText={saveTitle}
    />;
  }
  return <>{widget.title}</>;
}
