import { Droppable } from '@hello-pangea/dnd';
import { ReactElement } from 'react';
import { Widget as MLWidget } from '../../../model/MyLinks-interface';
import { Widget } from '../widget/Widget';

interface ColumnProps {
  readonly value: MLWidget[];
  readonly index: number;
}

export function Column(
  {
    value: columns,
    index
  }: ColumnProps
): ReactElement {
  const widgets = columns.map((widget, wIndex) => <Widget key={widget.id} value={widget} index={wIndex} />);
  return (
    <section className="ml-rows">
      <Droppable droppableId={`col-${index}`} type="widget">
        {provided =>
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {widgets}
            {provided.placeholder}
          </div>
        }
      </Droppable>
    </section>
  );
}
