import React, { ReactNode } from 'react';
import { MyLinkAction } from '../../model/Events';
import { openAllLinks } from '../../model/MyLinks';
import { Widget as MLWidget } from '../../model/MyLinks-interface';

interface WidgetToolbarProps {
  collapsed: boolean;
  widget: MLWidget;
  classNames?: string;
  action: MyLinkAction;
}

interface WidgetToolbarState {
  collapsed: boolean;
}

export class WidgetToolbar extends React.Component<WidgetToolbarProps, WidgetToolbarState> {
  constructor(props: WidgetToolbarProps) {
    super(props);
    this.state = { collapsed: this.props.collapsed };
  }

  render(): ReactNode {
    const collapseIcon = this.state.collapsed ? 'fa fa-angle-down' : 'fa fa-angle-up';
    const classNames = this.props.classNames ?? '';

    return (
      <span className={`ml-toolbar ${classNames}`}>
        <i className={`${collapseIcon} icon`} onClick={(): void => this.props.action({ target: 'collapse' })}/>
        <i className="fa fa-external-link-alt icon" onClick={(): void => openAllLinks(this.props.widget)}/>
      </span>
    );
  }
}
