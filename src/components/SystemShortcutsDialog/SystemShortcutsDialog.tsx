import { MouseEvent, ReactElement, useState } from 'react';
import { findShortcuts } from '../../common/shortcut/ShortcutManager';
import { useAppConfigContext } from '../../contexts/AppConfigContext';
import { AppActionDescription } from '../../model/AppActionDescription';
import { AppActionList, ShortcutAction } from '../../model/MyLinks-interface';
import { ListView } from '../listView/ListView';
import { ListViewItem } from '../listView/ListViewTypes';
import { getModal } from '../modal/ModalHandler';
import { CloseResultCode } from '../modal/ModalTypes';
import { ShortcutDetails } from './ShortcutDetails';
import './SystemShortcutsDialog.css';

type SystemShortcutProps = {
  readonly modalId: string;
  onSave(shortcuts: ShortcutAction[]): void;
};

function formSystemShortcut(systemShortcuts: ShortcutAction[] | undefined): ShortcutAction[] {
  if (systemShortcuts === undefined) {
    return [];
  }
  return AppActionList.map((action): ShortcutAction => ({
    description: AppActionDescription[action],
    shortcut: systemShortcuts.find(v => action === v.action)?.shortcut ?? '',
    action
  }));
}

export function SystemShortcutForm({ modalId, onSave }: SystemShortcutProps): ReactElement {
  const onCloseDialog = (code: CloseResultCode): void => getModal(modalId)?.close(code);

  function onClickSave(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();

    onSave(form);
    onCloseDialog(CloseResultCode.Ok);
  }

  function onClickClose(): void {
    onCloseDialog(CloseResultCode.Cancel);
  }

  function onSelectedItem(index: number): void {
    const item = form[index];
    const value = prompt(`Edit ${item.description}`, item.shortcut);
    if (value !== null) {
      if (findShortcuts(value).length > 0) {
        alert('Shortcut already assigned');
        return;
      }
      setForm(form.map(v => v.action === item.action ? { ...v, shortcut: value } : v));
    }
  }

  const { systemShortcuts } = useAppConfigContext();
  const [form, setForm] = useState(formSystemShortcut(systemShortcuts));

  const shortcutComponents = form.map((item): ListViewItem => (
    {
      id: item.action,
      element: <div><ShortcutDetails label={item.description ?? ''} combination={item.shortcut} /></div>
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
