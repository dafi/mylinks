import { Link, Widget } from './MyLinks-interface';

export interface EditData<T> {
  position?: number;
  editType: 'create' | 'update' | 'delete';
  editedProperties?: T;
}

export type LinkEditedProperties = Pick<Link, 'label' | 'url' | 'shortcut' | 'favicon'>;
export type WidgetEditedProperties = Pick<Widget, 'title'>;

export interface EditWidgetData extends EditData<WidgetEditedProperties> {
  widget: Widget;
}

export interface EditLinkData extends EditData<LinkEditedProperties> {
  link: Link;
  widget: Widget;
}

export type EditDataType = EditLinkData | EditWidgetData;
