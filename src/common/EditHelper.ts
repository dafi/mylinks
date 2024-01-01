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
import { KeyCombination } from '../model/KeyCombination';
import { Link } from '../model/MyLinks-interface';
import { move } from './ArrayUtil';
import { compareCombinationsArray } from './shortcut/ShortcutManager';

export function isLinkEditData(editData: EditDataType): editData is LinkEditData {
  return 'link' in editData;
}

export function prepareForSave(editData: EditDataType): boolean {
  return isLinkEditData(editData) ? prepareLinkForSave(editData) : prepareWidgetForSave(editData);
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
    if (Object.hasOwn(edited, p) && updateLinkProperty(link, p as keyof Link, edited[p as keyof LinkEditableProperties])) {
      modified = true;
    }
  }
  return modified;
}

function updateLinkProperty(
  link: Link,
  propName: keyof Link,
  value: string | KeyCombination[] | undefined
): boolean {
  if (propName === 'shortcut') {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        link[propName] = undefined;
        return true;
      }
      const oldValue = link[propName];
      if (oldValue === undefined || !compareCombinationsArray(value, oldValue)) {
        link[propName] = value;
        return true;
      }
    }
  } else if (typeof value === 'string' && link[propName] !== value) {
    link[propName] = value;
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
  assertMultiOpenForLinkDelete(editData);
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

function prepareWidgetForSave(editData: WidgetEditData): boolean {
  if (editData.editType === 'update') {
    editData.widget.title = editData.edited.title;
    return true;
  }
  return false;
}

function assertMultiOpenForLinkDelete(editData: LinkEditDataDelete): void {
  const { link: { id, label }, multiOpen } = editData;
  const inUse = multiOpen?.combinations.filter(v => v.linkIds.includes(id));

  if (inUse && inUse.length > 0) {
    const combinations = inUse.map(v => v.shortcut).join(', ');
    throw new Error(`Link '${label}' is used in multi open shortcuts (${combinations}), please delete them before link`);
  }
}
