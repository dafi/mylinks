import { MouseEvent, ReactNode } from 'react';
import { useAppUIStateContext } from '../../../contexts/AppUIStateContext';
import { EditAction } from '../../../model/EditData-interface';
import { Link as MLLink } from '../../../model/MyLinks-interface';
import { useWidgetContext } from '../contexts/WidgetContext';
import './Edit.css';

type LinkToolbarProps = Readonly<{
  visible: boolean;
  link: MLLink;
}>;

export function LinkToolbar({ visible, link }: LinkToolbarProps): ReactNode {
  function onEditLink(e: MouseEvent<HTMLElement>): void {
    e.stopPropagation();
    e.preventDefault();
    const action = e.currentTarget.dataset.action as EditAction;

    if (onEdit) {
      if (action === 'delete') {
        onEdit({
          link,
          widget,
          action,
          entity: 'link',
          original: link,
        });
      } else if (action === 'update') {
        onEdit({
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

  const { onEdit } = useAppUIStateContext();
  const { widget } = useWidgetContext();

  if (!visible) {
    return null;
  }

  return (
    <>
      <i
        className="fas fa-trash-alt edit-actions danger text-action-secondary"
        title="Delete"
        data-action="delete"
        onClick={onEditLink}
      />
      <i
        className="fa fa-edit edit-actions text-action-secondary"
        title="Edit"
        data-action="update"
        onClick={onEditLink}
      />
    </>
  );
}
