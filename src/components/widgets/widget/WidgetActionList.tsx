import { ReactElement } from 'react';
import { useAppUIStateContext } from '../../../contexts/AppUIStateContext';
import { Widget } from '../../../model/MyLinks-interface';

interface WidgetActionListProps {
  readonly editable: boolean;
  readonly widget: Widget;
}

export default function WidgetActionList({ editable, widget }: WidgetActionListProps): ReactElement | null {
  function onAddLink(): void {
    if (onEdit) {
      onEdit({
        link: { id: `${widget.id}-${Date.now()}`, urls: [''], hotKey: [], label: '' },
        edited: { urls: [''], hotKey: [], label: '' },
        widget,
        editType: 'create'
      });
    }
  }

  function onDelete(): void {
    const response = confirm(`Delete widget "${widget.title}"?`);
    if (response && onEdit) {
      onEdit({
        widget,
        original: widget,
        editType: 'delete',
      });
    }
  }

  const { onEdit } = useAppUIStateContext();

  if (editable) {
    return (
      <div className="ml-widget-button-container">
        <button type="button" className="button" onClick={onAddLink}>Add New Link</button>
        <button type="button" className="button danger" onClick={onDelete}>Delete Widget</button>
      </div>
    );
  }
  return null;
}
