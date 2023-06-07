import React, { ReactNode } from 'react';
import { AppConfigContext } from '../../common/AppConfigContext';
import { Link as MLLink } from '../../model/MyLinks-interface';
import { LinkIcon } from './LinkIcon';

export interface LinkProps {
  value: MLLink;
}

export interface LinkState {
  isMouseOver: boolean;
}

export class Link extends React.Component<LinkProps, LinkState> {
  static contextType = AppConfigContext;
  context!: React.ContextType<typeof AppConfigContext>;

  constructor(props: LinkProps) {
    super(props);
    this.state = { isMouseOver: false };
  }

  render(): ReactNode {
    const item = this.props.value;

    const style = {
      visibility: this.isShortcutVisible() ? 'visible' : 'collapse'
    } as React.CSSProperties;
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="ml-widget-item-link"
         onMouseEnter={(): void => this.setMouseOver(true)}
         onMouseLeave={(): void => this.setMouseOver(false)}>
        <div className="content">
          <div className="left-items">
            <LinkIcon link={item}/>
            <div className="label">{item.label}</div>
          </div>
          <div className="right-items">
            <kbd style={style}>{item.shortcut}</kbd>
          </div>
        </div>
      </a>
    );
  }

  private isShortcutVisible(): boolean {
    const appConfig = this.context;
    const item = this.props.value;

    if (!item.shortcut) {
      return false;
    }
    if (!appConfig.hideShortcuts) {
      return true;
    }
    return this.state.isMouseOver;
  }

  private setMouseOver(isOver: boolean): void {
    this.setState({ isMouseOver: isOver });
  }
}
