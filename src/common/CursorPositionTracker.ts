import { Point } from './DOMTypes';

const pos: Point = { x: 0, y: 0 };
let installed = false;

/**
 * Install the movements listener
 * @returns true if already installed, false otherwise
 */
export function installCursorPositionTracker(): boolean {
  if (installed) {
    return true;
  }
  document.addEventListener('mousemove', storeMousePosition, false);
  document.addEventListener('mouseenter', storeMousePosition, false);
  installed = true;

  return false;
}

export function uninstallCursorPositionTracker(): void {
  document.removeEventListener('mousemove', storeMousePosition, false);
  document.removeEventListener('mouseenter', storeMousePosition, false);
  installed = false;
}

export function cursorPosition(): Point {
  return { ...pos };
}

function storeMousePosition(e: MouseEvent): void {
  pos.x = e.clientX;
  pos.y = e.clientY;
}
