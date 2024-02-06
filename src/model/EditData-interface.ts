import { Link, Widget } from './MyLinks-interface';

export type EditAction = 'create' | 'update' | 'delete' | 'move';
export type EditEntity = 'link' | 'widget';

export type EditData<E extends EditEntity> = {
  action: EditAction;
  entity: E;
};

export type EditDataCreate<T, E extends EditEntity> = {
  action: 'create';
  edited: T;
} & EditData<E>;

export type EditDataDelete<T, E extends EditEntity> = {
  action: 'delete';
  original: T;
} & EditData<E>;

export type EditDataUpdate<T, E extends EditEntity> = {
  action: 'update';
  edited: T;
  original: T;
} & EditData<E>;

export type EditDataMove<E extends EditEntity> = {
  action: 'move';
  position: { fromId: string; toId: string };
} & EditData<E>;

type EditDataActions<T, E extends EditEntity> =
  EditDataCreate<T, E> |
  EditDataDelete<T, E> |
  EditDataUpdate<T, E> |
  EditDataMove<E>;

export type LinkEditableProperties = Pick<Link, 'label' | 'urls' | 'hotKey' | 'favicon'>;
export type WidgetEditableProperties = Pick<Widget, 'title'>;

export type EditWidgetFields = {
  widget: Widget;
};

export type EditLinkFields = {
  link: Link;
  widget: Widget;
};

export type WidgetEditData = EditDataActions<WidgetEditableProperties, 'widget'> & EditWidgetFields;
export type LinkEditData = EditDataActions<LinkEditableProperties, 'link'> & EditLinkFields;

export type LinkEditDataDelete = EditDataDelete<LinkEditableProperties, 'link'> & EditLinkFields;
export type LinkEditDataCreate = EditDataCreate<LinkEditableProperties, 'link'> & EditLinkFields;
export type LinkEditDataUpdate = EditDataUpdate<LinkEditableProperties, 'link'> & EditLinkFields;
export type LinkEditDataMove = EditDataMove<'link'> & EditLinkFields;

export type EditDataType = LinkEditData | WidgetEditData;
