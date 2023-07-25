import React from 'react';
import { Widget as MLWidget } from '../../../model/MyLinks-interface';
import { Widget } from '../widget/Widget';

interface ColumnProps {
  readonly value: MLWidget[];
}

export function Column({ value: columns }: ColumnProps): JSX.Element {
  const widgets = columns.map(widget => <Widget key={widget.id} value={widget} />);
  return (
    <section className="ml-rows">
      {widgets}
    </section>
  );
}
