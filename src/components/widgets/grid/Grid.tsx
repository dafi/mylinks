import { DragDropContext, DropResult, ResponderProvided } from '@hello-pangea/dnd';
import { ReactElement } from 'react';
import { useAppConfigContext } from '../../../contexts/AppConfigContext';
import { useAppUIStateContext } from '../../../contexts/AppUIStateContext';
import { isEditEntity } from '../../../model/EditData-interface';
import { Widget as MLWidget } from '../../../model/MyLinks-interface';
import { Column } from '../column/Column';

interface GridProps {
  readonly columns: MLWidget[][];
}

export function Grid({ columns }: GridProps): ReactElement {
  function onDragEnd(result: DropResult, _provided: ResponderProvided): void {
    const { source, destination } = result;

    if (source.droppableId === destination?.droppableId && source.index === destination.index) {
      return;
    }

    if (destination && onEdit && isEditEntity(result.type)) {
      onEdit({
        action: 'move',
        entity: result.type,
        source: { id: source.droppableId, index: source.index },
        destination: { id: destination.droppableId, index: destination.index },
        myLinksLookup,
      });
    }
  }

  const { onEdit } = useAppUIStateContext();
  const { myLinksLookup } = useAppConfigContext();

  const columnsEl = columns.map(
    // at this time columns can't be moved/dragged so using index is safe
    // eslint-disable-next-line react/no-array-index-key
    (widget, index) => <Column key={index} value={widget} index={index} />);

  return (
    <section className="ml-columns">
      <DragDropContext onDragEnd={onDragEnd}>
        {columnsEl}
      </DragDropContext>
    </section>
  );
}
