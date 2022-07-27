import React, { ReactNode } from 'react';
import { AppConfigContext } from '../../common/AppConfigContext';
import { faviconUrlByLink } from '../../model/MyLinks';
import { Link as MLLink } from '../../model/MyLinks-interface';
import './LinkIcon.css';

const colors = [
  '#FF5666', '#FFCB47', '#A9714B', '#531cb3',
  '#8377D1', '#28C2FF', '#3066BE', '#963484',
  '#729B79', '#44CF6C', '#3498db', '#FF0000',
  '#FE5D9F',
];

export interface LinkIconProps {
  link: MLLink;
  faviconService?: string | null | undefined;
}

export class LinkIcon extends React.Component<LinkIconProps, unknown> {
  static contextType = AppConfigContext;
  context!: React.ContextType<typeof AppConfigContext>;

  render(): ReactNode {
    const appConfig = this.context;
    const faviconService = this.props.faviconService ?? appConfig.faviconService;
    const faviconUrl = faviconUrlByLink(this.props.link, faviconService);

    if (faviconUrl) {
      return <img src={faviconUrl} className="link-icon-favicon" alt=""/>;
    }

    const label = this.props.link.label;
    const style: React.CSSProperties = {
      color: '#fff',
      backgroundColor: colors[this.hash(label) % colors.length]
    };

    const firstLetter = label.charAt(0);
    return <div style={style} className="link-icon-missing-favicon">{firstLetter}</div>;
  }

  hash(str: string): number {
    // the worst way to compute a hash value, but we only need that it is deterministic
    return Array
      .from(str)
      .reduce((p, c) => p + c.charCodeAt(0), str.length);
  }
}
