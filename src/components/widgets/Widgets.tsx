import React, { ReactNode } from 'react';
import { MyLinksEvent } from '../../model/Events';
import { Widget as MLWidget } from '../../model/MyLinks-interface';
import { Link } from './Link';
import { WidgetToolbar } from './WidgetToolbar';

export interface WidgetProps {
  value: MLWidget;
}

interface WidgetState {
  collapsed: boolean;
}

interface WidgetExtraCssClass {
  widget: string;
}

export class Widget extends React.Component<WidgetProps, WidgetState> {
  private startCollapsed = false;

  constructor(props: WidgetProps) {
    super(props);
    this.startCollapsed = localStorage.getItem(`${this.props.value.id}-collapsed`) === 't';
    this.state = { collapsed: this.startCollapsed };
  }

  toggleCollapse(collapsed: boolean): void {
    if (this.startCollapsed) {
      this.setState({ collapsed });
    }
  }

  toggleWidgetSize(): void {
    this.startCollapsed = !this.startCollapsed;
    localStorage.setItem(`${this.props.value.id}-collapsed`, this.startCollapsed ? 't' : 'f');
    this.setState({ collapsed: this.startCollapsed });
  }

  cssExtraClasses(): WidgetExtraCssClass {
    const collapsed = this.state.collapsed;
    const collapsedVisible = this.startCollapsed && !collapsed;
    const cls: WidgetExtraCssClass = {
      widget: '',
    };

    if (this.startCollapsed) {
      cls.widget += 'collapsed ';
    }
    if (collapsedVisible) {
      cls.widget += 'collapsed-visible ';
    }

    return cls;
  }

  onClickToolbar(_: MyLinksEvent): void {
    this.toggleWidgetSize();
  }

  render(): ReactNode {
    const widget = this.props.value;
    const items = widget.list.map(v => <li key={v.url}><Link value={v}/></li>);
    const cls = this.cssExtraClasses();

    return (
      <div className={`ml-widget ${cls.widget}`}
           data-list-id={widget.id}
           onMouseEnter={(): void => this.toggleCollapse(false)}
           onMouseLeave={(): void => this.toggleCollapse(true)}>
        <div>
          <h2 className="ml-widget-title">{widget.title}</h2>
          <WidgetToolbar
            collapsed={this.startCollapsed}
            widget={widget}
            action={(e): void => this.onClickToolbar(e)}
            classNames={'hover-toolbar'}/>
        </div>
        <div className="ml-widget-list-container">
          <ul className="ml-widget-list">{items}</ul>
        </div>
      </div>);
  }
}
