import React from 'react';
import { faviconUrlByLink } from '../../../common/Favicon';
import { useAppConfigContext } from '../../../contexts/AppConfigContext';
import { Link as MLLink } from '../../../model/MyLinks-interface';
import './LinkIcon.css';

const colors = [
  '#FF5666', '#A9714B', '#531CB3', '#28C2FF', '#3066BE', '#963484',
  '#729B79', '#44CF6C', '#3498DB', '#AAAAAA', '#0074D9', '#3D9970',
  '#2ECC40', '#B10DC9', '#0000FF', '#00FFFF', '#008080', '#00FF00',
  '#FF851B', '#FFA500', '#FF0000', '#F012BE', '#FF00FF',
];

function hash(str: string): number {
  // the worst way to compute a hash value, but we only need that it is deterministic
  return Array
    .from(str)
    .reduce((p, c) => p + c.charCodeAt(0), str.length);
}

interface LinkIconProps {
  link: MLLink;
  faviconService?: string | null;
}

const defaultProps = {
  faviconService: null
};

export function LinkIcon(
  {
    link,
    faviconService,
  }: LinkIconProps
): JSX.Element {
  const { faviconService: appFaviconService } = useAppConfigContext();
  const faviconUrl = faviconUrlByLink(link, faviconService ?? appFaviconService);

  if (faviconUrl) {
    return <img src={faviconUrl} className="link-icon-favicon" alt="" />;
  }

  const label = link.label;
  const style: React.CSSProperties = {
    color: '#fff',
    backgroundColor: colors[hash(label) % colors.length]
  };

  const firstLetter = label.charAt(0);
  return <div style={style} className="link-icon-favicon-missing">{firstLetter}</div>;
}

LinkIcon.defaultProps = defaultProps;
