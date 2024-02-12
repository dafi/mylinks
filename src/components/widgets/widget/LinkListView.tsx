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
    <ul className="ml-widget-list">
      <Droppable droppableId={widget.id} type="link">
        {provided =>
          <div
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
          </div>
        }
      </Droppable>
    </ul>
  );
}
