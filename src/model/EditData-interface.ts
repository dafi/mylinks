import { Link, Widget } from './MyLinks-interface';

export type EditType = 'create' | 'update' | 'delete' | 'move';

export interface EditData<T> {
  editType: EditType;
  edited?: T;
  original: T;
}

export type LinkEditedProperties = Pick<Link, 'label' | 'url' | 'shortcut' | 'favicon'>;
export type WidgetEditedProperties = Pick<Widget, 'title'>;

export interface EditWidgetData extends EditData<WidgetEditedProperties> {
  widget: Widget;
}

export interface EditLinkData extends EditData<LinkEditedProperties> {
  link: Link;
  widget: Widget;
  position?: { fromIndex: number; toIndex: number };
}

export type EditDataType = EditLinkData | EditWidgetData;
