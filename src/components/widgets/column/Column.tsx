import React from 'react';
import { Widget as MLWidget } from '../../../model/MyLinks-interface';
import { Widget } from '../widget/Widget';

interface ColumnProps {
  value: MLWidget[];
}

export function Column(props: ColumnProps): JSX.Element {
  const widgets = props.value.map(widget => <Widget key={widget.id} value={widget}/>);
  return <section className="ml-rows">{widgets}</section>;
}
