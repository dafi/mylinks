import {
  EditDataType,
  LinkEditableProperties,
  LinkEditData,
  LinkEditDataCreate,
  LinkEditDataDelete,
  LinkEditDataMove,
  LinkEditDataUpdate,
  WidgetEditData
} from '../model/EditData-interface';
import { Link } from '../model/MyLinks-interface';
import { MyLinksLookup } from '../model/MyLinksLookup';
import { move } from './ArrayUtil';
import { compareCombinationsArray } from './shortcut/ShortcutManager';

export function isLinkEditData(editData: EditDataType): editData is LinkEditData {
  return 'link' in editData;
}

export function prepareForSave(editData: EditDataType, myLinksLookup: MyLinksLookup | undefined): boolean {
  return isLinkEditData(editData) ? prepareLinkForSave(editData) : prepareWidgetForSave(editData, myLinksLookup);
}

function prepareLinkForSave(editData: LinkEditData): boolean {
  switch (editData.editType) {
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
      link[propName] = value[propName];
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
  const { fromIndex, toIndex } = editData.position;
  if (fromIndex >= 0 && toIndex >= 0) {
    editData.widget.list = move(editData.widget.list, fromIndex, toIndex);
    return true;
  }
  return false;
}

function prepareWidgetForSave(editData: WidgetEditData, myLinksLookup: MyLinksLookup | undefined): boolean {
  switch (editData.editType) {
    case 'update':
      editData.widget.title = editData.edited.title;
      return true;
    case 'delete':
      return myLinksLookup?.getWidgetGrid().deleteWidgetById(editData.widget.id) ?? false;
    case 'create':
    case 'move':
      break;
  }
  return false;
}
