import { ItemLocation, Widget } from './MyLinks-interface';

export interface WidgetGrid {
  findWidgetById(id: string): Widget | undefined;
  deleteWidgetById(id: string): boolean;
  move(source: ItemLocation, destination: ItemLocation): boolean;
}
