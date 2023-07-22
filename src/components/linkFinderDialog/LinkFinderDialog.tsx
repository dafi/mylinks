import React from 'react';
import { Link, Widget } from '../../model/MyLinks-interface';
import { DialogProps } from '../modal/Dialog';
import Modal from '../modal/Modal';
import { LinkSelector } from './LinkSelector';

interface LinkFinderDialogProps extends DialogProps {
  onLinkSelected: (link: Link) => void;
  widgets: Widget[][];
}

export function LinkFinderDialog(props: LinkFinderDialogProps): JSX.Element {
  function onClose(): void {
    props.onClose();
  }

  function onSelected(link: Link): void {
    props.onLinkSelected(link);
    onClose();
  }

  return (
    <Modal isOpen={props.isOpen}
           onClose={(): void => onClose()}>
      <LinkSelector
        onSelected={(l): void => onSelected(l)}
        widgets={props.widgets}/>
    </Modal>
  );
}
