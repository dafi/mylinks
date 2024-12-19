import { Droppable } from '@hello-pangea/dnd';
import { ReactNode } from 'react';
import { Widget as MLWidget } from '../../../model/MyLinks-interface';
import { Widget } from '../widget/Widget';
import './Column.css';

type ColumnProps = Readonly<{
  value: MLWidget[];
  index: number;
}>;

function getDroppableClassName(isDraggingOver: boolean): string | undefined {
  return isDraggingOver ? 'column droppable' : undefined;
}

export function Column(
  {
    value: columns,
    index
  }: ColumnProps
): ReactNode {
  const widgets = columns.map((widget, wIndex) => <Widget key={widget.id} value={widget} index={wIndex} />);
  return (
    <section className="ml-rows">
      <Droppable droppableId={`col-${index}`} type="widget">
        {(provided, snapshot) =>
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={getDroppableClassName(snapshot.isDraggingOver)}
          >
            {widgets}
            {provided.placeholder}
          </div>
        }
      </Droppable>
    </section>
  );
}
