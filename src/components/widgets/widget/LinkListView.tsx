import { Droppable } from '@hello-pangea/dnd';
import { ReactElement } from 'react';
import { Widget } from '../../../model/MyLinks-interface';
import { LinkListItem } from './LinkListItem';

type LinkListViewProps = {
  readonly widget: Widget;
  readonly editable: boolean;
};

export function LinkListView(
  {
    widget,
    editable
  }: LinkListViewProps
): ReactElement {
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
