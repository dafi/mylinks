import React from 'react';
import {AppConfigContext} from '../../common/AppConfigContext';
import {faviconUrlByLink, Link as MLLink, openAllLinks, Widget as MLWidget} from '../../model/MyLinks';

export interface LinkProps {
  value: MLLink
}

class Link extends React.Component<LinkProps, {}> {
  render() {
    const appConfig = this.context;
    const item = this.props.value;

    const style = {
      visibility: appConfig.hideShortcuts || !item.shortcut ? 'collapse' : 'visible'
    } as React.CSSProperties;
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="ml-widget-item-link">
        <div className="content">
          <div className="left-items">
            {this.image(item)}
            <div className="label">{item.label}</div>
          </div>
          <div className="right-items">
            <kbd style={style}>{item.shortcut}</kbd>
          </div>
        </div>
      </a>
    );
  }

  image(item: MLLink) {
    const faviconUrl = faviconUrlByLink(item, this.context.faviconService);

    if (faviconUrl) {
      return <img src={faviconUrl} className="ml-favicon" alt=''/>;
    }
    return <div className="missing-favicon ml-missing-favicon"/>;
  }
}

Link.contextType = AppConfigContext;

export interface WidgetProps {
  value: MLWidget
}

class Widget extends React.Component<WidgetProps, {}> {
  render() {
    const data = this.props.value;
    const items = data.list.map(v => <li key={v.url}><Link value={v}/></li>);
    return (
      <div className="ml-widget" data-list-id={data.id}>
        <div className="ml-widget-label">
          <h2>{data.title}</h2>
          <span className="ml-toolbar" onClick={() => openAllLinks(data)}>
            <i className="fa fa-external-link-alt"/>
          </span>
        </div>
        <ul>{items}</ul>
      </div>);
  }
}

export interface ColumnProps {
  value: MLWidget[]
}

class Column extends React.Component<ColumnProps, {}> {
  render() {
    const widgets = this.props.value.map(widget => <Widget key={widget.id} value={widget}/>);
    return <section className="ml-rows">{widgets}</section>;
  }
}

export interface GridProps {
  columns: [MLWidget[]]
}

export class Grid extends React.Component<GridProps, {}> {
  render() {
    const widgets = this.props.columns || [];
    const columns = widgets.map((columns: MLWidget[], index: number) => <Column key={index} value={columns}/>);
    return <section className="ml-columns">{columns}</section>;
  }
}
