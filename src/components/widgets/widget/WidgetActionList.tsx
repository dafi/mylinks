import { ReactElement } from 'react';
import { useAppConfigContext } from '../../../contexts/AppConfigContext';
import { useAppUIStateContext } from '../../../contexts/AppUIStateContext';
import { Widget } from '../../../model/MyLinks-interface';
import { useOpenDialog } from '../../modal/useShowDialog';
import { WidgetDialog, widgetDialogId } from './WidgetDialog';

type WidgetActionListProps = Readonly<{
  editable: boolean;
  widget: Widget;
}>;

export default function WidgetActionList({ editable, widget }: WidgetActionListProps): ReactElement | null {
  function onAddLink(): void {
    if (onEdit) {
      onEdit({
        link: { id: `${widget.id}-${Date.now()}`, urls: [''], hotKey: [], label: '' },
        edited: { urls: [''], hotKey: [], label: '' },
        widget,
        action: 'create',
        entity: 'link',
      });
    }
  }

  function onDelete(): void {
    const response = confirm(`Delete widget "${widget.title}"?`);
    if (response && onEdit) {
      onEdit({
        widget,
        original: widget,
        action: 'delete',
        entity: 'widget',
        myLinksLookup,
      });
    }
  }

  function onOpenSettings(): void {
    setIsDialogOpen(true);
  }

  function onSave(edited: Widget): void {
    if (onEdit) {
      onEdit({
        widget,
        action: 'update',
        entity: 'widget',
        edited,
        original: widget,
      });
    }
  }

  const { onEdit } = useAppUIStateContext();
  const { myLinksLookup } = useAppConfigContext();
  const [isDialogOpen, setIsDialogOpen] = useOpenDialog(widgetDialogId);

  if (editable) {
    return (
      <div className="ml-widget-button-container">
        <button type="button" className="button" onClick={onAddLink}>Add New Link</button>
        <button type="button" className="button danger" onClick={onDelete}>Delete Widget</button>
        <button type="button" className="button success" onClick={onOpenSettings}>Edit Widget</button>
        {isDialogOpen && <WidgetDialog widget={widget} onSave={onSave} />}
      </div>
    );
  }
  return null;
}
