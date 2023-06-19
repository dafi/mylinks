import React, { ReactNode } from 'react';
import { AppUIStateContext } from '../../common/AppUIStateContext';
import { Link as MLLink, Widget } from '../../model/MyLinks-interface';
import './Edit.css';
import './Link.css';
import { LinkIcon } from './LinkIcon';

export interface LinkProps {
  link: MLLink;
  widget: Widget;
  editable: boolean;
}

export interface LinkState {
  isMouseOver: boolean;
}

export class Link extends React.Component<LinkProps, LinkState> {
  static contextType = AppUIStateContext;
  context!: React.ContextType<typeof AppUIStateContext>;

  constructor(props: LinkProps) {
    super(props);
    this.state = { isMouseOver: false };
  }

  private renderShortcut(): ReactNode | null {
    if (this.isShortcutVisible()) {
      return <kbd>{this.props.link.shortcut}</kbd>;
    }
    return null;
  }

  private renderEditAction(): ReactNode | null {
    if (this.props.editable) {
      return <span className="edit-actions"
                   onClick={(e): void => this.onEdit(e)}>Edit Link</span>;
    }
    return null;
  }

  private isShortcutVisible(): boolean {
    const link = this.props.link;

    if (!link.shortcut) {
      return false;
    }
    if (!this.context.hideShortcuts) {
      return true;
    }
    return this.state.isMouseOver;
  }

  private setMouseOver(isOver: boolean): void {
    this.setState({ isMouseOver: isOver });
  }

  private onEdit(e: React.MouseEvent<HTMLElement>): void {
    e.stopPropagation();
    e.preventDefault();
    if (this.context.onEdit) {
      this.context.onEdit({
        link: this.props.link,
        widget: this.props.widget,
        editType: 'update'
      });
    }
  }

  render(): ReactNode {
    const link = this.props.link;

    return (
      <div className="ml-link-container">
        <div className="ml-link-items-container">
          <div className="left">
            <a href={link.url} target="_blank" rel="noopener noreferrer"
               onMouseEnter={(): void => this.setMouseOver(true)}
               onMouseLeave={(): void => this.setMouseOver(false)}>
              <div className="content">
                <LinkIcon link={link}/>
                <div className="label">{link.label}</div>
              </div>
            </a>
          </div>
          <div className="right">
            {this.renderEditAction()}
            {this.renderShortcut()}
          </div>
        </div>
      </div>
    );
  }
}
