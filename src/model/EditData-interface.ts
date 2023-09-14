import { Link, MultiOpen, Widget } from './MyLinks-interface';

export type EditType = 'create' | 'update' | 'delete' | 'move';

export type EditDataCreate<T> = {
  editType: 'create';
  edited: T;
};

export type EditDataDelete<T> = {
  editType: 'delete';
  original: T;
  multiOpen?: MultiOpen;
};

export type EditDataUpdate<T> = {
  editType: 'update';
  edited: T;
  original: T;
};

export type EditDataMove<T> = {
  editType: 'move';
  original: T;
  position: { fromIndex: number; toIndex: number };
};

export type EditData<T> = EditDataCreate<T> | EditDataDelete<T> | EditDataUpdate<T> | EditDataMove<T>;

export type LinkEditableProperties = Pick<Link, 'label' | 'url' | 'shortcut' | 'favicon'>;
export type WidgetEditableProperties = Pick<Widget, 'title'>;

export type EditWidgetFields = {
  widget: Widget;
};

export type EditLinkFields = {
  link: Link;
  widget: Widget;
};

export type WidgetEditData = EditData<WidgetEditableProperties> & EditWidgetFields;
export type LinkEditData = EditData<LinkEditableProperties> & EditLinkFields;

export type LinkEditDataCreate = EditDataCreate<LinkEditableProperties> & EditLinkFields;
export type LinkEditDataDelete = EditDataDelete<LinkEditableProperties> & EditLinkFields;
export type LinkEditDataUpdate = EditDataUpdate<LinkEditableProperties> & EditLinkFields;
export type LinkEditDataMove = EditDataMove<LinkEditableProperties> & EditLinkFields;

export type EditDataType = LinkEditData | WidgetEditData;
