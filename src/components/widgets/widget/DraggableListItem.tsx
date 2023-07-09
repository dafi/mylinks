import React, { ReactNode } from 'react';

type LIDragEvent = React.DragEvent<HTMLLIElement>;

/**
 * Do not use index for id
 */
export interface DraggableListItemProps {
  id: string;
  draggable: boolean;
  children: ReactNode;
  onDrop: (sourceId: string, destId: string) => void;
}

export class DraggableListItem extends React.Component<DraggableListItemProps, unknown> {
  constructor(props: DraggableListItemProps) {
    super(props);
  }

  handleDragStart(e: LIDragEvent): void {
    e.dataTransfer.setData('text/plain', e.currentTarget.id);
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  }

  handleDragOver(e: LIDragEvent): void {
    e.preventDefault();
    e.currentTarget.classList.add('over');
    e.dataTransfer.dropEffect = 'move';
  }

  handleDragLeave(e: LIDragEvent): void {
    e.currentTarget.classList.remove('over');
  }

  handleDrop(e: LIDragEvent): void {
    e.stopPropagation();
    const dragged = document.getElementById(e.dataTransfer.getData('text/plain'));
    if (dragged?.parentNode) {
      const dropped = e.currentTarget.closest(dragged.nodeName);
      if (dropped) {
        dragged.parentNode.removeChild(dragged);
        dropped?.insertAdjacentElement('beforebegin', dragged);

        this.props.onDrop(dragged.id, dropped.id);
      }
    }
    e.currentTarget.classList.remove('over');
  }

  handleDragEnd(e: LIDragEvent): void {
    e.currentTarget.classList.remove('over', 'dragging');
  }

  render(): ReactNode {
    const dragProps = this.props.draggable ? {
      draggable: true,
      onDragStart: (e: LIDragEvent): void => this.handleDragStart(e),
      // onDragEnter: (e: LIDragEvent): void => this.handleDragEnter(e),
      onDragOver: (e: LIDragEvent): void => this.handleDragOver(e),
      onDragLeave: (e: LIDragEvent): void => this.handleDragLeave(e),
      onDrop: (e: LIDragEvent): void => this.handleDrop(e),
      onDragEnd: (e: LIDragEvent): void => this.handleDragEnd(e),
    } : null;
    return (
      <li id={this.props.id} {...dragProps}>
        {this.props.children}
      </li>
    );
  }
}
