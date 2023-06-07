import React, { ReactNode } from 'react';
import { Widget as MLWidget } from '../../model/MyLinks-interface';
import { Widget } from './Widgets';

export interface ColumnProps {
  value: MLWidget[];
}

export class Column extends React.Component<ColumnProps, unknown> {
  render(): ReactNode {
    const widgets = this.props.value.map(widget => <Widget key={widget.id} value={widget}/>);
    return <section className="ml-rows">{widgets}</section>;
  }
}
