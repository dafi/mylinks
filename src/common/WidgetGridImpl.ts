import { Widget } from '../model/MyLinks-interface';
import { WidgetGrid } from '../model/WidgetGrid';

export class WidgetGridImpl implements WidgetGrid {
  constructor(
    private widgets: Widget[][],
  ) {}

  findWidgetById(id: string): Widget | undefined {
    return this.widgets.flat().find(w => w.id === id);
  }

  deleteWidgetById(id: string): boolean {
    let columnIndex = 0;
    for (const column of this.widgets) {
      if (this.deleteWidgetInColumn(column, columnIndex, id)) {
        return true;
      }
      ++columnIndex;
    }
    return false;
  }

  private deleteWidgetInColumn(column: Widget[], columnIndex: number, id: string): boolean {
    const index = column.findIndex(v => v.id === id);
    if (index < 0) {
      return false;
    }
    column.splice(index, 1);

    // last element in column
    if (column.length === 0) {
      this.widgets.splice(columnIndex, 1);
    }
    return true;
  }
}
