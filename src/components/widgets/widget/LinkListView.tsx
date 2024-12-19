import { Droppable } from '@hello-pangea/dnd';
import { ReactNode } from 'react';
import { Widget } from '../../../model/MyLinks-interface';
import { LinkListItem } from './LinkListItem';

type LinkListViewProps = Readonly<{
  widget: Widget;
  editable: boolean;
}>;

export function LinkListView(
  {
    widget,
    editable
  }: LinkListViewProps
): ReactNode {
  return (
    <Droppable droppableId={widget.id} type="link">
      {provided =>
        <ul
          className="ml-widget-list"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {widget.list.map((link, index) =>
            <LinkListItem
              key={link.id}
              link={link}
              widget={widget}
              editable={editable}
              index={index}
            />
          )}
          {provided.placeholder}
        </ul>
      }
    </Droppable>
  );
}
