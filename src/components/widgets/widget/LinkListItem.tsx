import { Draggable } from '@hello-pangea/dnd';
import { ReactNode } from 'react';
import { Link as MLLink } from '../../../model/MyLinks-interface';
import { Link } from '../link/Link';
import { useWidgetContext } from '../contexts/WidgetContext';

type LinkListItemProps = Readonly<{
  link: MLLink;
  index: number;
}>;

export function LinkListItem(
  {
    link,
    index,
  }: LinkListItemProps
): ReactNode {
  const { editable } = useWidgetContext();

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
          />
        </li>
      }
    </Draggable>
  );
}
