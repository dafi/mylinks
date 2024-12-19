import { Draggable } from '@hello-pangea/dnd';
import { ReactNode } from 'react';
import { Link as MLLink, Widget as MLWidget } from '../../../model/MyLinks-interface';
import { Link } from '../link/Link';

type LinkListItemProps = Readonly<{
  link: MLLink;
  widget: MLWidget;
  editable: boolean;
  index: number;
}>;

export function LinkListItem(
  {
    link,
    widget,
    editable,
    index,
  }: LinkListItemProps
): ReactNode {
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
