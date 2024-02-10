import { ReactElement } from 'react';
import { Link } from '../../model/MyLinks-interface';
import Modal from '../modal/Modal';
import { linkFinderDialogId } from './LinkFinderDialogTypes';
import { LinkSelector } from './LinkSelector';

interface LinkFinderDialogProps {
  readonly onLinkSelected: (link: Link) => void;
  readonly links: Link[] | undefined;
}

export function LinkFinderDialog(
  {
    onLinkSelected,
    links,
  }: LinkFinderDialogProps
): ReactElement | null {
  function onSelected(link: Link): void {
    onLinkSelected(link);
  }

  if (!links) {
    return null;
  }

  return (
    <Modal id={linkFinderDialogId}>
      <LinkSelector
        onSelected={onSelected}
        links={links}
      />
    </Modal>
  );
}
