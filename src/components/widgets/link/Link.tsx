import React, { useState } from 'react';
import { Link as MLLink, Widget } from '../../../model/MyLinks-interface';
import { LinkIcon } from '../linkIcon/LinkIcon';
import './Link.css';
import { LinkToolbar } from './LinkToolbar';
import { Shortcut } from './Shortcut';

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
): JSX.Element {
  const [isMouseOver, setIsMouseOver] = useState(false);

  return (
    <div className="ml-link-container"
         onMouseEnter={(): void => setIsMouseOver(true)}
         onMouseLeave={(): void => setIsMouseOver(false)}
    >
      <div className="ml-link-items-container">
        <div className="left">
          <a
            href={link.url}
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
