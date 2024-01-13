import { MouseEvent, ReactElement, useMemo, useRef, useState } from 'react';
import { useAppConfigContext } from '../../contexts/AppConfigContext';
import { AppActionDescription } from '../../model/AppActionDescription';
import { KeyCombination } from '../../model/KeyCombination';
import { AppActionList, ShortcutAction, ShortcutList } from '../../model/MyLinks-interface';
import { ListView } from '../listView/ListView';
import { ListViewItem } from '../listView/ListViewTypes';
import { getModal } from '../modal/ModalHandler';
import { CloseResultCode } from '../modal/ModalTypes';
import './SystemShortcutsDialog.css';
import { ShortcutDetails } from '../shortcut/shortcutDetails/ShortcutDetails';
import { ShortcutDialog } from '../shortcut/shortcutDialog/ShortcutDialog';
import { shortcutDialogId } from '../shortcut/shortcutDialog/ShortcutDialogTypes';

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
    extraCombinations.current = form.map(v => v.shortcutAction);
    setCombinationLabel(description);
    setDefaultCombination(shortcutAction.shortcut);
    setSelectedCombination([...shortcutAction.shortcut]);
    getModal(shortcutDialogId)?.open({
      onClose: (code, data) => {
        if (code === CloseResultCode.Ok && Array.isArray(data)) {
          setForm(form.map(v => v.shortcutAction.action === shortcutAction.action ?
            { ...v, shortcutAction: { ...v.shortcutAction, shortcut: data } } : v));
        }
      }
    });
  }

  const { systemShortcuts } = useAppConfigContext();
  const [form, setForm] = useState(formSystemShortcut(systemShortcuts));
  const extraCombinations = useRef<ShortcutList[]>([]);
  const [combinationLabel, setCombinationLabel] = useState('');
  const [defaultCombination, setDefaultCombination] = useState<KeyCombination[]>([]);
  const [selectedCombination, setSelectedCombination] = useState<KeyCombination[]>([]);

  const shortcutComponents = useMemo(() =>
    form.map(({ description, shortcutAction }): ListViewItem => (
      {
        id: shortcutAction.action,
        element: <div><ShortcutDetails label={description} combination={shortcutAction.shortcut} /></div>
      }))
  , [form]);

  return (
    <div className="panel">
      <section>
        <form>
          <div className="system-shortcuts">
            <ListView items={shortcutComponents} onSelected={onSelectedItem} />
          </div>
        </form>
      </section>

      <footer className="footer">
        <div className="toolbar">
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
        </div>
      </footer>
      <ShortcutDialog
        label={combinationLabel}
        defaultCombination={defaultCombination}
        keyCombination={selectedCombination}
        setKeyCombination={setSelectedCombination}
        extraCombinations={extraCombinations.current}
      />
    </div>
  );
}
