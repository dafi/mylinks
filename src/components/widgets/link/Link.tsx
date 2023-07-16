import React, { ReactNode, useContext, useState } from 'react';
import { AppUIStateContext } from '../../../contexts/AppUIStateContext';
import { Link as MLLink, Widget } from '../../../model/MyLinks-interface';
import { LinkIcon } from '../linkIcon/LinkIcon';
import { LinkToolbar } from './LinkToolbar';
import './Edit.css';
import './Link.css';

interface LinkProps {
  link: MLLink;
  widget: Widget;
  editable: boolean;
  draggable?: boolean;
}

export function Link(props: LinkProps): JSX.Element {
  function renderShortcut(): ReactNode {
    if (!props.editable && isShortcutVisible()) {
      return <kbd>{props.link.shortcut}</kbd>;
    }
    return null;
  }

  function isShortcutVisible(): boolean {
    if (!link.shortcut) {
      return false;
    }
    if (!context.hideShortcuts) {
      return true;
    }
    return isMouseOver;
  }

  const context = useContext(AppUIStateContext);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const link = props.link;
  const draggable = props.draggable === undefined ? true : props.draggable;

  return (
    <div className="ml-link-container">
      <div className="ml-link-items-container">
        <div className="left">
          <a href={link.url} target="_blank" rel="noopener noreferrer"
             draggable={draggable}
             onMouseEnter={(): void => setIsMouseOver(true)}
             onMouseLeave={(): void => setIsMouseOver(false)}>
            <div className="content">
              <LinkIcon link={link}/>
              <div className="label">{link.label}</div>
            </div>
          </a>
        </div>
        <div className="right">
          <LinkToolbar visible={props.editable} link={link} widget={props.widget}/>
          {renderShortcut()}
        </div>
      </div>
    </div>
  );
}
