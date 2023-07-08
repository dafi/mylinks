import React, { ReactNode } from 'react';
import { Widget as MLWidget } from '../../../model/MyLinks-interface';
import { Column } from '../column/Column';

export interface GridProps {
  columns: MLWidget[][];
}

export class Grid extends React.Component<GridProps, unknown> {
  render(): ReactNode {
    const widgets = this.props.columns || [];
    const columnsEl = widgets.map(
      (columns: MLWidget[], index: number) => <Column key={index} value={columns}/>);
    return <section className="ml-columns">{columnsEl}</section>;
  }
}
