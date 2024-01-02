import { MouseEvent, ReactElement, useState } from 'react';
import { findShortcuts } from '../../common/shortcut/ShortcutManager';
import { useAppConfigContext } from '../../contexts/AppConfigContext';
import { AppActionDescription } from '../../model/AppActionDescription';
import { KeyCombination } from '../../model/KeyCombination';
import { AppActionList, ShortcutAction } from '../../model/MyLinks-interface';
import { ListView } from '../listView/ListView';
import { ListViewItem } from '../listView/ListViewTypes';
import { getModal } from '../modal/ModalHandler';
import { CloseResultCode } from '../modal/ModalTypes';
import './SystemShortcutsDialog.css';
import { ShortcutDetails } from '../shortcut/ShortcutDetails';

type SystemShortcutProps = {
  readonly modalId: string;
  onSave(shortcuts: ShortcutAction[]): void;
};

type FormShortcut = {
  description: string;
  shortcutAction: ShortcutAction;
};

function formSystemShortcut(systemShortcuts: ShortcutAction[] | undefined): FormShortcut[] {
  return AppActionList.map((action): FormShortcut => ({
    description: AppActionDescription[action],
    shortcutAction: {
      shortcut: systemShortcuts?.find(v => action === v.action)?.shortcut ?? [],
      action
    }
  }));
}

export function SystemShortcutForm({ modalId, onSave }: SystemShortcutProps): ReactElement {
  const onCloseDialog = (code: CloseResultCode): void => getModal(modalId)?.close(code);

  function onClickSave(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();

    onSave(form.map(v => v.shortcutAction).filter(v => v.shortcut.length > 0));
    onCloseDialog(CloseResultCode.Ok);
  }

  function onClickClose(): void {
    onCloseDialog(CloseResultCode.Cancel);
  }

  function onSelectedItem(index: number): void {
    const { description, shortcutAction } = form[index];
    const value = prompt(`Edit ${description}`, shortcutAction.shortcut.map(v => v.key).join(''));
    if (value !== null) {
      const keyCombination = value.split('').map((v): KeyCombination => ({ key: v }));
      if (findShortcuts(keyCombination).length > 0) {
        alert('Shortcut already assigned');
        return;
      }
      setForm(form.map(v => v.shortcutAction.action === shortcutAction.action ?
        { ...v, shortcutAction: { ...v.shortcutAction, shortcut: keyCombination } } : v));
    }
  }

  const { systemShortcuts } = useAppConfigContext();
  const [form, setForm] = useState(formSystemShortcut(systemShortcuts));

  const shortcutComponents = form.map(({ description, shortcutAction }): ListViewItem => (
    {
      id: shortcutAction.action,
      element: <div><ShortcutDetails label={description} combination={shortcutAction.shortcut} /></div>
    })
  );

  return (
    <form>
      <div className="system-shortcuts">
        <ListView items={shortcutComponents} onSelected={onSelectedItem} />
      </div>
      <ul className="flex-outer">
        <li className="toolbar">
          <div className="toolbar-left" />
          <div className="toolbar-right">
            <button
              type="button"
              className="text-white bg-action-primary hover"
              onClick={onClickSave}
            >
              Save
            </button>
            <button
              type="button"
              className="text-white bg-action-secondary hover right"
              onClick={onClickClose}
            >
              Close
            </button>
          </div>
        </li>
      </ul>
    </form>
  );
}
