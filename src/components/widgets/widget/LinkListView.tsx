import { Droppable } from '@hello-pangea/dnd';
import { ReactNode } from 'react';
import { LinkListItem } from './LinkListItem';
import { useWidgetContext } from '../contexts/WidgetContext';

export function LinkListView(): ReactNode {
  const { widget } = useWidgetContext();

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
              index={index}
            />
          )}
          {provided.placeholder}
        </ul>
      }
    </Droppable>
  );
}
