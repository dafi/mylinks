import React from 'react';
import { useAppUIStateContext } from '../../../contexts/AppUIStateContext';
import { EditType } from '../../../model/EditData-interface';
import { Link as MLLink, Widget } from '../../../model/MyLinks-interface';
import './Edit.css';

interface LinkToolbarProps {
  readonly visible: boolean;
  readonly link: MLLink;
  readonly widget: Widget;
}

export function LinkToolbar({ visible, link, widget }: LinkToolbarProps): JSX.Element | null {
  function onEdit(e: React.MouseEvent<HTMLElement>, editType: EditType): void {
    e.stopPropagation();
    e.preventDefault();

    if (context.onEdit) {
      context.onEdit({
        link,
        widget,
        editType
      });
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
        onClick={(e): void => onEdit(e, 'delete')}
      />
      <i
        className="fa fa-edit edit-actions text-action-secondary"
        title="Edit"
        onClick={(e): void => onEdit(e, 'update')}
      />
    </>
  );
}
