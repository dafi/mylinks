import React, { ReactNode } from 'react';
import { DialogProps } from '../modal/Dialog';
import Modal from '../modal/Modal';
import { Link, Widget } from '../../model/MyLinks-interface';
import { LinkSelector } from './LinkSelector';

export interface LinkFinderDialogProps extends DialogProps {
  onLinkSelected: (link: Link) => void;
  widgets?: Widget[][];
}

export class LinkFinderDialog extends React.Component<LinkFinderDialogProps, unknown> {
  onClose(): void {
    this.props.onClose();
  }

  onSelected(link: Link): void {
    this.props.onLinkSelected(link);
    this.onClose();
  }

  render(): ReactNode {
    return (
      <Modal isOpen={this.props.isOpen}
             onClose={(): void => this.onClose()}>
        <LinkSelector
          onSelected={(l): void => this.onSelected(l)}
          widgets={this.props.widgets}/>
      </Modal>
    );
  }
}
