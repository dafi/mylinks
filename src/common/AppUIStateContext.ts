import React from 'react';
import { Link, Widget } from '../model/MyLinks-interface';

export type LinkEditedProperties = Pick<Link, 'label' | 'url' | 'shortcut'>;
export type WidgetEditedProperties = Pick<Widget, 'title'>;

export interface EditData<T> {
  position?: number;
  editType: 'create' | 'update' | 'delete';
  editedProperties?: T;
}

export interface EditWidgetData extends EditData<WidgetEditedProperties> {
  widget: Widget;
}

export interface EditLinkData extends EditData<LinkEditedProperties> {
  link: Link;
  widget: Widget;
}

export type EditDataType = EditLinkData | EditWidgetData;

export function isEditLinkData(editData: EditDataType): editData is EditLinkData {
  return (editData as EditLinkData).link !== undefined;
}

export function isEditWidgetData(editData: EditDataType): editData is EditWidgetData {
  return (editData as EditWidgetData).widget !== undefined;
}

export interface AppUIState {
  hideShortcuts: boolean;
  onEdit?: (editData: EditDataType) => void;
}

const defaultAppUIState = {
  hideShortcuts: false,
};

export const AppUIStateContext = React.createContext<AppUIState>(defaultAppUIState);
