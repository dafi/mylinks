import React, { ReactNode } from 'react';
import Modal from '../modal/Modal';
import { Link, Widget } from '../../model/MyLinks-interface';
import { LinkSelector } from './LinkSelector';

export interface DialogProps {
  isOpen: boolean;
  onLinkSelected: (link: Link) => void;
  onClose: () => void;
  widgets?: [Widget[]];
}

export class LinkFinderDialog extends React.Component<DialogProps, unknown> {
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
