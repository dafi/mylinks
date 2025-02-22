import { MouseEvent, ReactNode } from 'react';
import { openLink } from '../../../model/MyLinks';
import { Link as MLLink } from '../../../model/MyLinks-interface';
import { Shortcut } from '../../shortcut/Shortcut';
import { LinkIcon } from '../linkIcon/LinkIcon';
import './Link.css';
import { useWidgetContext } from '../contexts/WidgetContext';
import { LinkToolbar } from './LinkToolbar';

type LinkProps = Readonly<{
  link: MLLink;
  draggable?: boolean;
}>;

export function Link(
  {
    link,
    draggable = true,
  }: LinkProps
): ReactNode {
  const { editable, isMouseOver } = useWidgetContext();

  function onClick(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    openLink(link);
  }

  return (
    <div className="ml-link-container">
      <div className="left">
        <a
          onClick={onClick}
          className="link-box"
          draggable={draggable}
        >
          <LinkIcon link={link} />
          <div className="label">{link.label}</div>
        </a>
      </div>
      <div className="right">
        <LinkToolbar visible={editable} link={link} />
        <Shortcut shortcut={link.hotKey} visible={!editable} isMouseOver={isMouseOver} />
      </div>
    </div>
  );
}
