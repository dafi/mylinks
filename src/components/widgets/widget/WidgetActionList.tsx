import { ReactNode } from 'react';
import { useAppConfigContext } from '../../../contexts/AppConfigContext';
import { useAppUIStateContext } from '../../../contexts/AppUIStateContext';
import { Widget } from '../../../model/MyLinks-interface';
import { Button } from '../../button/Button';
import { useOpenDialog } from '../../modal/useShowDialog';
import { WidgetDialog, widgetDialogId } from './WidgetDialog';

type WidgetActionListProps = Readonly<{
  editable: boolean;
  widget: Widget;
}>;

export default function WidgetActionList({ editable, widget }: WidgetActionListProps): ReactNode {
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
        <Button
          label="Add New Link"
          className="button"
          onClick={onAddLink}
        />
        <Button
          label="Delete Widget"
          className="button"
          scope="danger"
          onClick={onDelete}
        />
        <Button
          label="Edit Widget"
          className="button"
          scope="success"
          onClick={onOpenSettings}
        />
        {isDialogOpen && <WidgetDialog widget={widget} onSave={onSave} />}
      </div>
    );
  }
  return null;
}
