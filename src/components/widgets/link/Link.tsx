import React, { ReactNode, useContext, useState } from 'react';
import { AppUIStateContext } from '../../../contexts/AppUIStateContext';
import { Link as MLLink, Widget } from '../../../model/MyLinks-interface';
import { LinkIcon } from '../linkIcon/LinkIcon';
import { LinkToolbar } from './LinkToolbar';
import './Link.css';

interface LinkProps {
  link: MLLink;
  widget: Widget;
  editable: boolean;
  draggable?: boolean;
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
  function renderShortcut(): ReactNode {
    if (!editable && isShortcutVisible()) {
      return <kbd>{link.shortcut}</kbd>;
    }
    return null;
  }

  function isShortcutVisible(): boolean {
    if (!link.shortcut) {
      return false;
    }
    if (!hideShortcuts) {
      return true;
    }
    return isMouseOver;
  }

  const { hideShortcuts } = useContext(AppUIStateContext);
  const [isMouseOver, setIsMouseOver] = useState(false);

  return (
    <div className="ml-link-container">
      <div className="ml-link-items-container">
        <div className="left">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            draggable={draggable}
            onMouseEnter={(): void => setIsMouseOver(true)}
            onMouseLeave={(): void => setIsMouseOver(false)}
          >
            <div className="content">
              <LinkIcon link={link} />
              <div className="label">{link.label}</div>
            </div>
          </a>
        </div>
        <div className="right">
          <LinkToolbar visible={editable} link={link} widget={widget} />
          {renderShortcut()}
        </div>
      </div>
    </div>
  );
}

Link.defaultProps = defaultProps;
