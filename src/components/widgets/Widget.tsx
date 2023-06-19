import React, { ReactNode } from 'react';
import { AppUIStateContext } from '../../common/AppUIStateContext';
import { MyLinksEvent } from '../../model/Events';
import { Widget as MLWidget } from '../../model/MyLinks-interface';
import { Link } from './Link';
import { WidgetToolbar, WidgetToolbarActionType } from './WidgetToolbar';
import './Widget.css';

export interface WidgetProps {
  value: MLWidget;
}

interface WidgetState {
  collapsed: boolean;
  editable: boolean;
}

interface WidgetExtraCssClass {
  widget: string;
}

export class Widget extends React.Component<WidgetProps, WidgetState> {
  static contextType = AppUIStateContext;
  context!: React.ContextType<typeof AppUIStateContext>;
  private startCollapsed = false;

  constructor(props: WidgetProps) {
    super(props);
    this.startCollapsed = localStorage.getItem(`${this.props.value.id}-collapsed`) === 't';
    this.state = { collapsed: this.startCollapsed, editable: false };
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

  onClickToolbar(e: MyLinksEvent<WidgetToolbarActionType>): void {
    if (e.target === 'collapse') {
      this.toggleWidgetSize();
    } else if (e.target === 'edit') {
      this.setState({
        editable: e.data as boolean
      });
    }
  }

  onAddLink(): void {
    if (this.context.onEdit) {
      const widget = this.props.value;
      this.context.onEdit({
        link: { id: `${widget.id}-${new Date().getTime()}`, url: '', shortcut: '', label: '' },
        widget,
        editType: 'new'
      });
    }
  }

  renderButtons(): ReactNode | null {
    if (this.state.editable) {
      return (
        <div className="ml-widget-button-container">
          <button className="button" onClick={(): void => this.onAddLink()}>Add New Link</button>
        </div>
      );
    }
    return null;
  }

  render(): ReactNode {
    const widget = this.props.value;
    const items = widget.list.map(v => <li key={v.url}>
      <Link
        link={v}
        widget={widget}
        editable={this.state.editable}/>
    </li>);
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
        {this.renderButtons()}
      </div>);
  }
}
