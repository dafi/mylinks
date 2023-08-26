import { ModalAction } from './ModalTypes';

const modals = new Map<string, ModalAction>();

export function getModal(id: string): ModalAction | undefined {
  return modals.get(id);
}

export function registerModal(id: string, modalAction: ModalAction): void {
  modals.set(id, modalAction);
}

export function unregisterModal(id: string): void {
  modals.delete(id);
}
