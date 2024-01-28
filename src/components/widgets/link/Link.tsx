import { MouseEvent, ReactElement, useState } from 'react';
import { openLink } from '../../../model/MyLinks';
import { Link as MLLink, Widget } from '../../../model/MyLinks-interface';
import { Shortcut } from '../../shortcut/Shortcut';
import { LinkIcon } from '../linkIcon/LinkIcon';
import './Link.css';
import { LinkToolbar } from './LinkToolbar';

interface LinkProps {
  readonly link: MLLink;
  readonly widget: Widget;
  readonly editable: boolean;
  readonly draggable?: boolean;
}

const defaultProps = {
  draggable: true
};

export function Link(
  {
    link,
    widget,
    editable,
    draggable = true,
  }: LinkProps
): ReactElement {
  const [isMouseOver, setIsMouseOver] = useState(false);

  function onClickMultipleUrl(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();
    openLink(link);
  }

  const attrs = link.urls.length === 1
    ? { href: link.urls[0] }
    : { href: '#', onClick: onClickMultipleUrl };

  return (
    <div
      className="ml-link-container"
      onMouseEnter={(): void => setIsMouseOver(true)}
      onMouseLeave={(): void => setIsMouseOver(false)}
    >
      <div className="ml-link-items-container">
        <div className="left">
          <a
            {...attrs}
            target="_blank"
            rel="noopener noreferrer"
            draggable={draggable}
          >
            <div className="content">
              <LinkIcon link={link} />
              <div className="label">{link.label}</div>
            </div>
          </a>
        </div>
        <div className="right">
          <LinkToolbar visible={editable} link={link} widget={widget} />
          <Shortcut shortcut={link.shortcut} visible={!editable} isMouseOver={isMouseOver} />
        </div>
      </div>
    </div>
  );
}

Link.defaultProps = defaultProps;
