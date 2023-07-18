import React, { useContext } from 'react';
import { AppUIStateContext } from '../../../contexts/AppUIStateContext';
import { Widget } from '../../../model/MyLinks-interface';

interface WidgetActionListProps {
  editable: boolean;
  widget: Widget;
}

export default function WidgetActionList({ editable, widget }: WidgetActionListProps): JSX.Element | null {
  function onAddLink(): void {
    if (context.onEdit) {
      context.onEdit({
        link: { id: `${widget.id}-${new Date().getTime()}`, url: '', shortcut: '', label: '' },
        widget,
        editType: 'create'
      });
    }
  }

  const context = useContext(AppUIStateContext);

  if (editable) {
    return (
      <div className="ml-widget-button-container">
        <button className="button" onClick={onAddLink}>Add New Link</button>
      </div>
    );
  }
  return null;
}
