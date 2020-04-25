import React from 'react';
import {ThemeContext} from '../../common/ThemeContext';
import WidgetData, { openAllLinks } from '../../model/WidgetData';
import { WidgetLink } from '../../model/WidgetLink';

export interface LinkProps { value: WidgetLink }

class Link extends React.Component<LinkProps, {}> {
  render() {
    const item = this.props.value;
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="ml-widget-item-link">
        {this.image(item)}
        <div className="label">{item.label}</div>
      </a>
    );
  }

  image(item: WidgetLink) {
    if (item.favicon) {
      return <i className="ml-favicon"><img src={item.favicon} alt=''/></i>;
    }
    return <i className="ml-favicon"><div className="ml-missing-favicon" /></i>;
  }
}

Link.contextType = ThemeContext;

export interface WidgetProps { value: WidgetData }

class Widget extends React.Component<WidgetProps, {}> {
  render() {
    const data = this.props.value;
    const items = data.list.map(v => <li key={v.url}> <Link value={v} /> </li>);
    return (
      <div className="ml-widget" data-list-id={data.id}>
        <div className="ml-widget-label">
          <h2>{data.title}</h2>
          <span className="ml-toolbar" onClick={ () => openAllLinks(data)}>
            <i className="fa fa-external-link"></i>
          </span>
        </div>
        <ul>{ items }</ul>
      </div>);
  }
}

export interface ColumnProps { value: WidgetData[] }

class Column extends React.Component<ColumnProps, {}> {
  render() {
    const widgets = this.props.value.map(widget => <Widget key={widget.id} value={widget} />);
    return <section className="ml-rows">{widgets}</section>;
  }
}

export interface GridProps { columns: [WidgetData[]] }

export class Grid extends React.Component<GridProps, {}> {
  render() {
    const widgets = this.props.columns || [];
    const columns = widgets.map((columns: WidgetData[], index: number) => <Column key={index} value={columns}/>);
    return <section className="ml-columns">{columns}</section>;
  }  
}
