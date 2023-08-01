import { DragEvent, ReactElement } from 'react';

type LIDragEvent = DragEvent<HTMLLIElement>;

/**
 * Do not use index for id
 */
export interface DraggableListItemProps {
  readonly id: string;
  readonly draggable: boolean;
  readonly children: ReactElement;
  readonly onDrop: (sourceId: string, destId: string) => void;
}

export function DraggableListItem(
  {
    id,
    draggable,
    children,
    onDrop,
  }: DraggableListItemProps
): ReactElement {
  function handleDragStart(e: LIDragEvent): void {
    e.dataTransfer.setData('text/plain', e.currentTarget.id);
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e: LIDragEvent): void {
    e.preventDefault();
    e.currentTarget.classList.add('over');
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDragLeave(e: LIDragEvent): void {
    e.currentTarget.classList.remove('over');
  }

  function handleDrop(e: LIDragEvent): void {
    e.stopPropagation();
    const dragged = document.getElementById(e.dataTransfer.getData('text/plain'));
    if (dragged?.parentNode) {
      const dropped = e.currentTarget.closest(dragged.nodeName);
      if (dropped) {
        dragged.parentNode.removeChild(dragged);
        dropped.insertAdjacentElement('beforebegin', dragged);

        onDrop(dragged.id, dropped.id);
      }
    }
    e.currentTarget.classList.remove('over');
  }

  function handleDragEnd(e: LIDragEvent): void {
    e.currentTarget.classList.remove('over', 'dragging');
  }

  const dragProps = draggable ? {
    draggable: true,
    onDragStart: handleDragStart,
    // onDragEnter: handleDragEnter,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
    onDragEnd: handleDragEnd,
  } : null;
  return (
    // no extra props are passed so, we can spread them
    // eslint-disable-next-line react/jsx-props-no-spreading
    <li id={id} {...dragProps}>
      {children}
    </li>
  );
}
