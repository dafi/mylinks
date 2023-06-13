import React, { ReactNode } from 'react';
import { AppUIStateContext } from '../../common/AppUIStateContext';
import { Link as MLLink } from '../../model/MyLinks-interface';
import { LinkIcon } from './LinkIcon';
import './Link.css';

export interface LinkProps {
  value: MLLink;
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
      return <kbd>{this.props.value.shortcut}</kbd>;
    }
    return null;
  }

  private isShortcutVisible(): boolean {
    const item = this.props.value;

    if (!item.shortcut) {
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

  render(): ReactNode {
    const item = this.props.value;

    return (
      <div className="ml-link-container">
        <div className="ml-link-items-container">
          <div className="left">
            <a href={item.url} target="_blank" rel="noopener noreferrer"
               onMouseEnter={(): void => this.setMouseOver(true)}
               onMouseLeave={(): void => this.setMouseOver(false)}>
              <div className="content">
                <LinkIcon link={item}/>
                <div className="label">{item.label}</div>
              </div>
            </a>
          </div>
          <div className="right">
            {this.renderShortcut()}
          </div>
        </div>
      </div>
    );
  }
}
