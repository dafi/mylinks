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

export type EditDataUpdate<T, E extends EditEntity> = {
  action: 'update';
  edited: T;
  original?: T;
} & EditData<E>;

export type EditDataDelete<T, E extends EditEntity> = {
  action: 'delete';
  original: T;
} & EditData<E>;

export type EditDataMove<E extends EditEntity> = {
  action: 'move';
  source: ItemLocation;
  destination: ItemLocation;
  myLinksLookup: MyLinksLookup;
} & EditData<E>;

export type LinkEditableProperties = Pick<Link, 'label' | 'urls' | 'hotKey' | 'favicon'>;
export type WidgetEditableProperties = Pick<Partial<Widget>, 'title' | 'collapsed'>;

export type EditWidgetFields = {
  widget: Widget;
};

export type EditLinkFields = {
  link: Link;
  widget: Widget;
};

export type WidgetEditDataCreate = {
  myLinksLookup: MyLinksLookup;
} & EditDataCreate<Widget, 'widget'>;

export type WidgetEditDataDelete = {
  myLinksLookup: MyLinksLookup;
} & EditDataDelete<WidgetEditableProperties, 'widget'> & EditWidgetFields;

export type WidgetEditDataUpdate = EditDataUpdate<WidgetEditableProperties, 'widget'> & EditWidgetFields;
export type WidgetEditDataMove = EditDataMove<'widget'>;

export type WidgetEditData =
  WidgetEditDataCreate |
  WidgetEditDataUpdate |
  WidgetEditDataDelete |
  WidgetEditDataMove
  ;

export type LinkEditDataCreate = EditDataCreate<LinkEditableProperties, 'link'> & EditLinkFields;
export type LinkEditDataUpdate = EditDataUpdate<LinkEditableProperties, 'link'> & EditLinkFields;
export type LinkEditDataDelete = EditDataDelete<LinkEditableProperties, 'link'> & EditLinkFields;
export type LinkEditDataMove = EditDataMove<'link'>;

export type LinkEditData =
  LinkEditDataCreate |
  LinkEditDataUpdate |
  LinkEditDataDelete |
  LinkEditDataMove
  ;

export type EditDataType = LinkEditData | WidgetEditData;

export function isEditEntity(v: string): v is EditEntity {
  return editEntities.includes(v as EditEntity);
}

export function isLinkEditData(editData: EditDataType): editData is LinkEditData {
  return editData.entity === 'link';
}

