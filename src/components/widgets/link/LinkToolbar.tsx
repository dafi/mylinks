import React, { useContext } from 'react';
import { AppUIStateContext } from '../../../contexts/AppUIStateContext';
import { EditType } from '../../../model/EditData-interface';
import { Link as MLLink, Widget } from '../../../model/MyLinks-interface';

interface LinkToolbarProps {
  visible: boolean;
  link: MLLink;
  widget: Widget;
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

  if (!visible) {
    return null;
  }

  const context = useContext(AppUIStateContext);

  return (
    <>
      <i className="fas fa-trash-alt edit-actions danger text-action-secondary"
         title="Delete"
         onClick={(e): void => onEdit(e, 'delete')}/>
      <i className="fa fa-edit edit-actions text-action-secondary"
         title="Edit" onClick={(e): void => onEdit(e, 'update')}/>
    </>
  );
}
