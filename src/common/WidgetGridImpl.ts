import { ItemLocation, Widget } from '../model/MyLinks-interface';
import { WidgetGrid } from '../model/WidgetGrid';
import { move } from './ArrayUtil';

function extractColumnIndex(id: string): number | undefined {
  const index = id.match(/col-(\d+)/)?.at(1);

  return index === undefined ? undefined : Number.parseInt(index, 10);
}

export class WidgetGridImpl implements WidgetGrid {
  constructor(
    private widgets: Widget[][],
  ) {}

  createWidget(widget: Widget): boolean {
    const column: Widget[] = [];
    column.push(widget);
    this.widgets.splice(0, 0, column);

    return true;
  }

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

  move(source: ItemLocation, destination: ItemLocation): boolean {
    if (source.id === destination.id) {
      const columnIndex = extractColumnIndex(source.id);

      if (columnIndex !== undefined) {
        this.widgets[columnIndex] = move(this.widgets[columnIndex], source.index, destination.index);
        return true;
      }
    } else {
      const sourceColumnIndex = extractColumnIndex(source.id);
      const destinationColumnIndex = extractColumnIndex(destination.id);

      if (sourceColumnIndex !== undefined && destinationColumnIndex !== undefined) {
        const sourceWidget = this.widgets[sourceColumnIndex];
        const destinationWidget = this.widgets[destinationColumnIndex];

        const [widget] = sourceWidget.splice(source.index, 1);
        destinationWidget.splice(destination.index, 0, widget);

        // last element in column
        if (sourceWidget.length === 0) {
          this.widgets.splice(sourceColumnIndex, 1);
        }
        return true;
      }
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
