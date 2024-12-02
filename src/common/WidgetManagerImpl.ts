import { ItemLocation, Widget } from '../model/MyLinks-interface';
import { WidgetManager } from '../model/WidgetManager';
import { move } from './ArrayUtil';
import { isNotEmptyString } from './StringUtil';

function extractColumnIndex(id: string): number | undefined {
  const index = id.match(/col-(\d+)/)?.at(1);

  return index === undefined ? undefined : Number.parseInt(index, 10);
}

export class WidgetManagerImpl implements WidgetManager {
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
    if (source.id === destination.id && source.index === destination.index) {
      return false;
    }
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
    if (index === -1) {
      return false;
    }
    column.splice(index, 1);

    // last element in column
    if (column.length === 0) {
      this.widgets.splice(columnIndex, 1);
    }
    return true;
  }

  expandAllWidgets(): boolean {
    return this.changeAllCollapsedStatus(false);
  }

  collapseAllWidgets(): boolean {
    return this.changeAllCollapsedStatus(true);
  }

  private changeAllCollapsedStatus(collapsed: boolean): boolean {
    if (this.widgets.length === 0) {
      return false;
    }
    this.widgets.flat().forEach((widget) => { widget.collapsed = collapsed; });
    return true;
  }

  closestWidget(element: Element): Widget | undefined {
    const widgetAttributeName = 'data-list-id';
    const widgetId = element
      .closest(`[${widgetAttributeName}]`)
      ?.getAttribute(widgetAttributeName);

    return isNotEmptyString(widgetId) ? this.findWidgetById(widgetId) : undefined;
  }
}
