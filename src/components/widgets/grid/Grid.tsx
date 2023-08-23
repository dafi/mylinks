import { ReactElement } from 'react';
import { Widget as MLWidget } from '../../../model/MyLinks-interface';
import { Column } from '../column/Column';

interface GridProps {
  readonly columns: MLWidget[][];
}

export function Grid({ columns }: GridProps): ReactElement {
  const columnsEl = columns.map(
    // at this time columns can't be moved/dragged so using index is safe
    // eslint-disable-next-line react/no-array-index-key
    (widget, index) => <Column key={index} value={widget} />);
  return (
    <section className="ml-columns">
      {columnsEl}
    </section>
  );
}
