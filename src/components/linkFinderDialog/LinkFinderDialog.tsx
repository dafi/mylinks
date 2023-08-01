import { ReactElement } from 'react';
import { Link, Widget } from '../../model/MyLinks-interface';
import { DialogProps } from '../modal/Dialog';
import Modal from '../modal/Modal';
import { LinkSelector } from './LinkSelector';

interface LinkFinderDialogProps extends DialogProps {
  readonly onLinkSelected: (link: Link) => void;
  readonly widgets: Widget[][];
}

export function LinkFinderDialog(
  {
    onLinkSelected,
    widgets,
    isOpen,
    onClose,
  }: LinkFinderDialogProps
): ReactElement {
  function onCloseDialog(): void {
    onClose();
  }

  function onSelected(link: Link): void {
    onLinkSelected(link);
    onCloseDialog();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={(): void => onCloseDialog()}
    >
      <LinkSelector
        onSelected={(l): void => onSelected(l)}
        widgets={widgets}
      />
    </Modal>
  );
}
