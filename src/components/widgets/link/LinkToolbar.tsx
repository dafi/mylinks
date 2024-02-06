import { MouseEvent, ReactElement } from 'react';
import { useAppUIStateContext } from '../../../contexts/AppUIStateContext';
import { EditAction } from '../../../model/EditData-interface';
import { Link as MLLink, Widget } from '../../../model/MyLinks-interface';
import './Edit.css';

interface LinkToolbarProps {
  readonly visible: boolean;
  readonly link: MLLink;
  readonly widget: Widget;
}

export function LinkToolbar({ visible, link, widget }: LinkToolbarProps): ReactElement | null {
  function onEdit(e: MouseEvent<HTMLElement>): void {
    e.stopPropagation();
    e.preventDefault();
    const action = e.currentTarget.dataset.action as EditAction;

    if (context.onEdit) {
      if (action === 'delete') {
        context.onEdit({
          link,
          widget,
          action,
          entity: 'link',
          original: link,
        });
      } else if (action === 'update') {
        context.onEdit({
          link,
          widget,
          action,
          entity: 'link',
          edited: link,
          original: { ...link },
        });
      }
    }
  }

  const context = useAppUIStateContext();

  if (!visible) {
    return null;
  }

  return (
    <>
      <i
        className="fas fa-trash-alt edit-actions danger text-action-secondary"
        title="Delete"
        data-action="delete"
        onClick={onEdit}
      />
      <i
        className="fa fa-edit edit-actions text-action-secondary"
        title="Edit"
        data-action="update"
        onClick={onEdit}
      />
    </>
  );
}
