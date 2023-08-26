import { ReactElement } from 'react';
import { Link, Widget } from '../../model/MyLinks-interface';
import Modal from '../modal/Modal';
import { LinkSelector } from './LinkSelector';

export const linkFinderDialogId = 'finderDialog';

interface LinkFinderDialogProps {
  readonly onLinkSelected: (link: Link) => void;
  readonly widgets: Widget[][] | undefined;
}

export function LinkFinderDialog(
  {
    onLinkSelected,
    widgets,
  }: LinkFinderDialogProps
): ReactElement | null {
  function onSelected(link: Link): void {
    onLinkSelected(link);
  }

  if (!widgets) {
    return null;
  }

  return (
    <Modal id={linkFinderDialogId}>
      <LinkSelector
        onSelected={onSelected}
        widgets={widgets}
      />
    </Modal>
  );
}
