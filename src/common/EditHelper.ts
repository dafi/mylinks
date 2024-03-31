import {
  EditDataType,
  isLinkEditData,
  LinkEditableProperties,
  LinkEditData,
  LinkEditDataCreate,
  LinkEditDataDelete,
  LinkEditDataMove,
  LinkEditDataUpdate,
  WidgetEditData,
  WidgetEditDataUpdate
} from '../model/EditData-interface';
import { Link } from '../model/MyLinks-interface';
import { compareCombinationsArray } from './shortcut/ShortcutManager';
import { isNotEmptyString } from './StringUtil';

export function prepareForSave(editData: EditDataType): boolean {
  return isLinkEditData(editData) ? prepareLinkForSave(editData) : prepareWidgetForSave(editData);
}

function prepareLinkForSave(editData: LinkEditData): boolean {
  switch (editData.action) {
    case 'create':
      return createLink(editData);
    case 'update':
      return updateLink(editData);
    case 'delete':
      return deleteLink(editData);
    case 'move':
      return moveLink(editData);
    default:
      return false;
  }
}

function applyLinkProperties(edited: LinkEditableProperties, link: Link): boolean {
  let modified = false;
  for (const p in edited) {
    if (Object.hasOwn(edited, p) && updateLinkProperty(link, p as keyof LinkEditableProperties, edited)) {
      modified = true;
    }
  }
  return modified;
}

function updateLinkProperty(
  link: Link,
  propName: keyof LinkEditableProperties,
  value: LinkEditableProperties
): boolean {
  switch (propName) {
    case 'hotKey': {
      const v = value[propName];
      if (v === undefined || v.length === 0) {
        link[propName] = undefined;
        return true;
      }
      const oldValue = link[propName];
      if (oldValue === undefined || !compareCombinationsArray(v, oldValue)) {
        link[propName] = v;
        return true;
      }
    }
      break;
    case 'urls':
      link[propName] = value[propName];
      return true;
    case 'favicon':
      link[propName] = isNotEmptyString(value[propName]) ? value[propName] : undefined;
      return true;
    case 'label':
      link[propName] = value[propName];
      return true;
  }
  return false;
}

function createLink(editData: LinkEditDataCreate): boolean {
  const modified = applyLinkProperties(editData.edited, editData.link);

  if (modified) {
    editData.widget.list.push(editData.link);
  }

  return modified;
}

function updateLink(editData: LinkEditDataUpdate): boolean {
  return applyLinkProperties(editData.edited, editData.link);
}

function deleteLink(editData: LinkEditDataDelete): boolean {
  const response = confirm(`Delete link "${editData.link.label}"?`);
  if (response) {
    const index = editData.widget.list.findIndex(l => l.id === editData.link.id);
    if (index >= 0) {
      editData.widget.list.splice(index, 1);
    }
  }
  return response;
}

function moveLink(editData: LinkEditDataMove): boolean {
  return editData.myLinksLookup.linkManager.moveLink(editData.source, editData.destination);
}

function prepareWidgetForSave(editData: WidgetEditData): boolean {
  switch (editData.action) {
    case 'update':
      return updateWidget(editData);
    case 'delete':
      return editData.myLinksLookup.widgetManager.deleteWidgetById(editData.widget.id);
    case 'create':
      return editData.myLinksLookup.widgetManager.createWidget(editData.edited);
    case 'move':
      return editData.myLinksLookup.widgetManager.move(editData.source, editData.destination);
    default:
      return false;
  }
}

function updateWidget(editData: WidgetEditDataUpdate): boolean {
  if (editData.edited.title !== undefined) {
    editData.widget.title = editData.edited.title;
  }
  if (editData.edited.collapsed !== undefined) {
    editData.widget.collapsed = editData.edited.collapsed;
  }
  return true;
}
