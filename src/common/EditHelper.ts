import { EditData, EditDataType, EditLinkData, EditWidgetData, LinkEditedProperties } from '../model/EditData-interface';
import { Link } from '../model/MyLinks-interface';

export function isEditLinkData(editData: EditDataType): editData is EditLinkData {
  return (editData as EditLinkData).link !== undefined;
}

export function isEditWidgetData(editData: EditDataType): editData is EditWidgetData {
  return (editData as EditWidgetData).widget !== undefined;
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
  let canSave = false;
  const editType = editData.editType;

  if (editType === 'update') {
    canSave = updateLink(editData);
  } else if (editType === 'create') {
    canSave = createLink(editData);
  } else if (editType === 'delete') {
    canSave = deleteLink(editData);
  }

  return canSave;
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

function prepareWidgetForSave(editData: EditWidgetData): boolean {
  if (editData.editType === 'update') {
    editData.widget.title = safeEditedProperties(editData).title;
    return true;
  }
  return false;
}
