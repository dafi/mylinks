import React, { ReactNode } from 'react';
import { MyLinkActionCallback } from '../../../model/Events';
import { openAllLinks } from '../../../model/MyLinks';
import { Widget as MLWidget } from '../../../model/MyLinks-interface';
import './widgetToolbar.css';

export type WidgetToolbarActionType = 'collapse' | 'edit';

interface WidgetToolbarProps {
  collapsed: boolean;
  widget: MLWidget;
  classNames?: string;
  action: MyLinkActionCallback<WidgetToolbarActionType>;
  editable: boolean;
}

export class WidgetToolbar extends React.Component<WidgetToolbarProps, unknown> {
  constructor(props: WidgetToolbarProps) {
    super(props);
  }

  render(): ReactNode {
    const collapseIcon = this.props.collapsed ? 'fa fa-angle-down' : 'fa fa-angle-up';
    const collapseTitle = this.props.collapsed ? 'Expand content' : 'Collapse content';
    const classNames = this.props.classNames ?? '';
    const editStyle: React.CSSProperties = {
      color: this.props.editable ? 'var(--action-color-primary)' : ''
    };
    const editClassNames = this.props.editable ? 'fas fa-toggle-on' : 'fas fa-toggle-off';

    return (
      <span className={`ml-toolbar ${classNames}`}>
        <i className={`${editClassNames} icon`}
           style={editStyle}
           onClick={(): void => this.props.action({ target: 'edit' })}
           title="Toggle Edit Mode"/>
        <i className="fa fa-external-link-alt icon" onClick={(): void => openAllLinks(this.props.widget)} title="Open all links"/>
        <i className={`${collapseIcon} icon`} onClick={(): void => this.props.action({ target: 'collapse' })} title={collapseTitle}/>
      </span>
    );
  }
}
