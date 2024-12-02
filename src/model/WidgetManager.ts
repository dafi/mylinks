import { ItemLocation, Widget } from './MyLinks-interface';

export interface WidgetManager {
  createWidget(widget: Widget): boolean;
  findWidgetById(id: string): Widget | undefined;
  deleteWidgetById(id: string): boolean;
  move(source: ItemLocation, destination: ItemLocation): boolean;
  collapseAllWidgets(): boolean;
  expandAllWidgets(): boolean;
  closestWidget(element: Element): Widget | undefined;
}
