import React, { ReactNode } from 'react';
import { openAllLinks } from '../../model/MyLinks';
import { Widget as MLWidget } from '../../model/MyLinks-interface';
import { Link } from './Link';

export interface WidgetProps {
  value: MLWidget;
}

interface WidgetState {
  isMinimized: boolean;
}

interface WidgetExtraCssClass {
  window: string;
  listContainer: string;
  list: string;
  expandIcon: string;
}

class Widget extends React.Component<WidgetProps, WidgetState> {
  private startMinimized = false;

  constructor(props: WidgetProps) {
    super(props);
    this.startMinimized = localStorage.getItem(`${this.props.value.id}-minimized`) === 't';
    this.state = { isMinimized: this.startMinimized };
  }

  toggleMinimize(mini: boolean): void {
    if (this.startMinimized) {
      this.setState({ isMinimized: mini });
    }
  }

  toggleWidgetSize(): void {
    this.startMinimized = !this.startMinimized;
    localStorage.setItem(`${this.props.value.id}-minimized`, this.startMinimized ? 't' : 'f');
    this.setState({ isMinimized: this.startMinimized });
  }

  cssExtraClasses(): WidgetExtraCssClass {
    const cls: WidgetExtraCssClass = {
      window: '',
      list: '',
      listContainer: '',
      expandIcon: ''
    };

    if (this.startMinimized) {
      if (this.state.isMinimized) {
        cls.list = 'ml-widget-show-minimized-list-hidden';
      } else {
        cls.window = 'ml-widget-show-minimized-window';
        cls.listContainer = 'ml-widget-show-minimized-list-container';
        cls.list = 'ml-widget-show-minimized-list-visible';
        cls.expandIcon = 'fa fa-angle-down';
      }
    } else {
      cls.expandIcon = 'fa fa-angle-up';
    }
    return cls;
  }

  render(): ReactNode {
    const data = this.props.value;
    const items = data.list.map(v => <li key={v.url}><Link value={v}/></li>);
    const cssClasses = this.cssExtraClasses();

    return (
      <div className={`ml-widget ${cssClasses.window}`} data-list-id={data.id}
           onMouseOver={(): void => this.toggleMinimize(false)}
           onMouseOut={(): void => this.toggleMinimize(true)}>
        <div className="ml-widget-label">
          <h2>{data.title}</h2>
          <span className="ml-toolbar">
            <i className={`${cssClasses.expandIcon} icon`} onClick={(): void => this.toggleWidgetSize()}/>
            <i className="fa fa-external-link-alt icon" onClick={(): void => openAllLinks(data)}/>
          </span>
        </div>
        <div className={cssClasses.listContainer}>
          <ul className={`ml-widget-list ${cssClasses.list}`}>{items}</ul>
        </div>
      </div>);
  }
}

export interface ColumnProps {
  value: MLWidget[];
}

class Column extends React.Component<ColumnProps, unknown> {
  render(): ReactNode {
    const widgets = this.props.value.map(widget => <Widget key={widget.id} value={widget}/>);
    return <section className="ml-rows">{widgets}</section>;
  }
}

export interface GridProps {
  columns: [MLWidget[]];
}

export class Grid extends React.Component<GridProps, unknown> {
  render(): ReactNode {
    const widgets = this.props.columns || [];
    const columnsEl = widgets.map(
      (columns: MLWidget[], index: number) => <Column key={index} value={columns}/>);
    return <section className="ml-columns">{columnsEl}</section>;
  }
}
