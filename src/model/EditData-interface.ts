import { Link, Widget, ItemLocation } from './MyLinks-interface';
import { MyLinksLookup } from './MyLinksLookup';

const editEntities = ['link', 'widget'] as const;

export type EditAction = 'create' | 'update' | 'delete' | 'move';
export type EditEntity = typeof editEntities[number];

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
  source: ItemLocation;
  destination: ItemLocation;
  myLinksLookup: MyLinksLookup;
} & EditData<E>;

type EditDataActions<T, E extends EditEntity> =
  EditDataCreate<T, E> |
  EditDataUpdate<T, E> |
  EditDataMove<E>;

export type WidgetEditDataDelete = {
  action: 'delete';
  original: WidgetEditableProperties;
  myLinksLookup: MyLinksLookup;
} & EditData<'widget'>;


export type LinkEditableProperties = Pick<Link, 'label' | 'urls' | 'hotKey' | 'favicon'>;
export type WidgetEditableProperties = Pick<Widget, 'title'>;

export type EditWidgetFields = {
  widget: Widget;
};

export type EditLinkFields = {
  link: Link;
  widget: Widget;
};

export type WidgetEditData = (EditDataActions<WidgetEditableProperties, 'widget'> | WidgetEditDataDelete) & EditWidgetFields;

export type LinkEditData = (EditDataActions<LinkEditableProperties, 'link'> | LinkEditDataDelete) & EditLinkFields;

export type LinkEditDataDelete = EditDataDelete<LinkEditableProperties, 'link'> & EditLinkFields;
export type LinkEditDataCreate = EditDataCreate<LinkEditableProperties, 'link'> & EditLinkFields;
export type LinkEditDataUpdate = EditDataUpdate<LinkEditableProperties, 'link'> & EditLinkFields;
export type LinkEditDataMove = EditDataMove<'link'>;

export type EditDataType = LinkEditData | WidgetEditData | EditDataMove<EditEntity>;

export function isEditEntity(v: string): v is EditEntity {
  return editEntities.includes(v as EditEntity);
}

export function isLinkEditData(editData: EditDataType): editData is LinkEditData | LinkEditDataMove {
  return editData.entity === 'link';
}

