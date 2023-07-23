import React from 'react';
import { Widget as MLWidget } from '../../../model/MyLinks-interface';
import { Column } from '../column/Column';

interface GridProps {
  columns: MLWidget[][];
}

export function Grid({ columns }: GridProps): JSX.Element {
  const columnsEl = columns.map(
    // at this time columns can't be moved/dragged so using index is safe
    // eslint-disable-next-line react/no-array-index-key
    (widget: MLWidget[], index: number) => <Column key={index} value={widget} />);
  return (
    <section className="ml-columns">
      {columnsEl}
    </section>
  );
}
