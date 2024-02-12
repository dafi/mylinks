import { Draggable } from '@hello-pangea/dnd';
import { ReactElement } from 'react';
import { Link as MLLink, Widget as MLWidget } from '../../../model/MyLinks-interface';
import { Link } from '../link/Link';

type LinkListItemProps = {
  readonly link: MLLink;
  readonly widget: MLWidget;
  readonly editable: boolean;
  readonly index: number;
};

export function LinkListItem(
  {
    link,
    widget,
    editable,
    index,
  }: LinkListItemProps
): ReactElement {
  return (
    <Draggable
      draggableId={link.id}
      isDragDisabled={!editable}
      index={index}
    >
      {dragProvided =>
        <li
          id={link.id}
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
        >
          <Link
            link={link}
            draggable={!editable}
            widget={widget}
            editable={editable}
          />
        </li>
      }
    </Draggable>
  );
}
