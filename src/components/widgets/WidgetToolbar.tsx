import React, { ReactNode } from 'react';
import { MyLinkActionCallback } from '../../model/Events';
import { openAllLinks } from '../../model/MyLinks';
import { Widget as MLWidget } from '../../model/MyLinks-interface';

export type WidgetToolbarActionType = 'collapse' | 'edit';

interface WidgetToolbarProps {
  collapsed: boolean;
  widget: MLWidget;
  classNames?: string;
  action: MyLinkActionCallback<WidgetToolbarActionType>;
}

interface WidgetToolbarState {
  editable: boolean;
}

export class WidgetToolbar extends React.Component<WidgetToolbarProps, WidgetToolbarState> {
  constructor(props: WidgetToolbarProps) {
    super(props);
    this.state = { editable: false };
  }

  onToggleEdit(): void {
    this.setState(prevState => {
      const newState = {
        editable: !prevState.editable
      };
      this.props.action({ target: 'edit', data: newState.editable });
      return newState;
    });
  }

  render(): ReactNode {
    const collapseIcon = this.props.collapsed ? 'fa fa-angle-down' : 'fa fa-angle-up';
    const collapseTitle = this.props.collapsed ? 'Expand content' : 'Collapse content';
    const classNames = this.props.classNames ?? '';
    const editStyle: React.CSSProperties = {
      color: this.state.editable ? 'var(--action-color)' : ''
    };

    return (
      <span className={`ml-toolbar ${classNames}`}>
        <i className="fa fa-edit icon" style={editStyle} onClick={(): void => this.onToggleEdit()} title="Edit"/>
        <i className={`${collapseIcon} icon`} onClick={(): void => this.props.action({ target: 'collapse' })} title={collapseTitle}/>
        <i className="fa fa-external-link-alt icon" onClick={(): void => openAllLinks(this.props.widget)} title="Open all links"/>
      </span>
    );
  }
}
