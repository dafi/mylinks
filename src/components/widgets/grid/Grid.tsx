import React from 'react';
import { Widget as MLWidget } from '../../../model/MyLinks-interface';
import { Column } from '../column/Column';

interface GridProps {
  columns: MLWidget[][];
}

export function Grid(props: GridProps): JSX.Element {
  const columnsEl = props.columns.map(
    (widget: MLWidget[], index: number) => <Column key={index} value={widget}/>);
  return <section className="ml-columns">{columnsEl}</section>;
}
