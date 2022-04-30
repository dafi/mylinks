import React, { ReactNode } from 'react';
import { AppConfigContext } from '../../common/AppConfigContext';
import { faviconUrlByLink } from '../../model/MyLinks';
import { Link as MLLink } from '../../model/MyLinks-interface';

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
            {this.image(item)}
            <div className="label">{item.label}</div>
          </div>
          <div className="right-items">
            <kbd style={style}>{item.shortcut}</kbd>
          </div>
        </div>
      </a>
    );
  }

  image(item: MLLink): JSX.Element {
    const faviconUrl = faviconUrlByLink(item, this.context.faviconService);

    if (faviconUrl) {
      return <img src={faviconUrl} className="ml-favicon" alt=""/>;
    }
    return <div className="missing-favicon ml-missing-favicon"/>;
  }
}
