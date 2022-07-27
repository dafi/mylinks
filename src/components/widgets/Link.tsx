import React, { ReactNode } from 'react';
import { AppConfigContext } from '../../common/AppConfigContext';
import { Link as MLLink } from '../../model/MyLinks-interface';
import { LinkIcon } from './LinkIcon';

export interface LinkProps {
  value: MLLink;
}

export class Link extends React.Component<LinkProps, unknown> {
  static contextType = AppConfigContext;
  context!: React.ContextType<typeof AppConfigContext>;

  render(): ReactNode {
    const appConfig = this.context;
    const item = this.props.value;

    const style = {
      visibility: appConfig.hideShortcuts || !item.shortcut ? 'collapse' : 'visible'
    } as React.CSSProperties;
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="ml-widget-item-link">
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
}
