import { ModalAction } from './ModalTypes';

const modals = new Map<string, ModalAction>();

export function getModal(id: string): ModalAction {
  const m = modals.get(id);

  if (!m) {
    throw new Error(`Unable to find modal id ${id}`);
  }
  return m;
}

export function registerModal(id: string, modalAction: ModalAction): void {
  modals.set(id, modalAction);
}

export function unregisterModal(id: string): void {
  modals.delete(id);
}
