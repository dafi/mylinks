import React, { ReactNode } from 'react';
import { MyLinkActionCallback } from '../../model/Events';
import { openAllLinks } from '../../model/MyLinks';
import { Widget as MLWidget } from '../../model/MyLinks-interface';

export type WidgetToolbarActionType = 'collapse';

interface WidgetToolbarProps {
  collapsed: boolean;
  widget: MLWidget;
  classNames?: string;
  action: MyLinkActionCallback<WidgetToolbarActionType>;
}

export class WidgetToolbar extends React.Component<WidgetToolbarProps, unknown> {
  constructor(props: WidgetToolbarProps) {
    super(props);
  }

  render(): ReactNode {
    const collapseIcon = this.props.collapsed ? 'fa fa-angle-down' : 'fa fa-angle-up';
    const classNames = this.props.classNames ?? '';

    return (
      <span className={`ml-toolbar ${classNames}`}>
        <i className={`${collapseIcon} icon`} onClick={(): void => this.props.action({ target: 'collapse' })}/>
        <i className="fa fa-external-link-alt icon" onClick={(): void => openAllLinks(this.props.widget)}/>
      </span>
    );
  }
}
