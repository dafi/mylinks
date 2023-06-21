import React from 'react';
import { Link, Widget } from '../model/MyLinks-interface';

export interface EditData {
  position?: number;
  editType: 'create' | 'update' | 'delete';
}

export interface EditWidgetData extends EditData {
  widget: Widget;
}

export interface EditLinkData extends EditData {
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
