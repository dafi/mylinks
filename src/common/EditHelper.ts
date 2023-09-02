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
import { move } from './ArrayUtil';

export function isEditLinkData(editData: EditDataType): editData is LinkEditData {
  return 'link' in editData;
}

export function prepareForSave(editData: EditDataType): boolean {
  return isEditLinkData(editData) ? prepareLinkForSave(editData) : prepareWidgetForSave(editData);
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
  }
}

function applyLinkProperties(edited: LinkEditableProperties, link: Link): boolean {
  let modified = false;
  for (const p in edited) {
    if (Object.hasOwn(edited, p)) {
      const value = edited[p as keyof LinkEditableProperties];
      const propName = p as keyof Link;
      if (link[propName] !== value) {
        modified = true;
        if (value) {
          link[propName] = value;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete link[propName];
        }
      }
    }
  }
  return modified;
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

function prepareWidgetForSave(editData: WidgetEditData): boolean {
  if (editData.editType === 'update') {
    editData.widget.title = editData.edited.title;
    return true;
  }
  return false;
}
