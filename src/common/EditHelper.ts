import { EditData, EditDataType, EditLinkData, EditWidgetData, LinkEditedProperties } from '../model/EditData-interface';
import { Link } from '../model/MyLinks-interface';
import { move } from './ArrayUtil';

export function isEditLinkData(editData: EditDataType): editData is EditLinkData {
  return 'link' in editData;
}

export function isEditWidgetData(editData: EditDataType): editData is EditWidgetData {
  return 'widget' in editData;
}

export function prepareForSave(editData: EditDataType): boolean {
  return isEditLinkData(editData) ? prepareLinkForSave(editData) : prepareWidgetForSave(editData);
}

function safeEditedProperties<T>(editData: EditData<T>): T {
  const editedProperties = editData.editedProperties;

  if (editedProperties) {
    return editedProperties;
  }
  throw new Error(`Edited properties are mandatory for edit type ${editData.editType}`);
}

function prepareLinkForSave(editData: EditLinkData): boolean {
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

function applyLinkProperties(edited: LinkEditedProperties, link: Link): boolean {
  let modified = false;
  for (const p in edited) {
    if (Object.hasOwn(edited, p)) {
      const value = edited[p as keyof LinkEditedProperties];
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


function createLink(editData: EditLinkData): boolean {
  const modified = applyLinkProperties(safeEditedProperties(editData), editData.link);

  if (modified) {
    editData.widget.list.push(editData.link);
  }

  return modified;
}

function updateLink(editData: EditLinkData): boolean {
  return applyLinkProperties(safeEditedProperties(editData), editData.link);
}

function deleteLink(editData: EditLinkData): boolean {
  const response = confirm(`Delete link "${editData.link.label}"?`);
  if (response) {
    const index = editData.widget.list.findIndex(l => l.id === editData.link.id);
    if (index >= 0) {
      editData.widget.list.splice(index, 1);
    }
  }
  return response;
}

function moveLink(editData: EditLinkData): boolean {
  if (editData.position) {
    const { fromIndex, toIndex } = editData.position;
    if (fromIndex >= 0 && toIndex >= 0) {
      editData.widget.list = move(editData.widget.list, fromIndex, toIndex);
      return true;
    }
  }
  return false;
}

function prepareWidgetForSave(editData: EditWidgetData): boolean {
  if (editData.editType === 'update') {
    editData.widget.title = safeEditedProperties(editData).title;
    return true;
  }
  return false;
}
