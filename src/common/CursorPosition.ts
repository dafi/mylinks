import { Point } from './DOMTypes';

export class CursorPosition {
  private static mInstance?: CursorPosition;
  private pos: Point = { x: 0, y: 0 };
  private installed = false;
  private readonly moveHandler: OmitThisParameter<(e: MouseEvent) => void>;

  static instance(): CursorPosition {
    if (!this.mInstance) {
      this.mInstance = new this();
    }
    return this.mInstance;
  }

  private constructor() {
    this.moveHandler = this.storeMousePosition.bind(this);
  }

  /**
   * Install the movements listener
   * @returns true if already installed, false otherwise
   */
  install(): boolean {
    if (this.installed) {
      return true;
    }
    document.addEventListener('mousemove', this.moveHandler, false);
    document.addEventListener('mouseenter', this.moveHandler, false);
    this.installed = true;

    return false;
  }

  uninstall(): void {
    document.removeEventListener('mousemove', this.moveHandler, false);
    document.removeEventListener('mouseenter', this.moveHandler, false);
    this.installed = false;
  }

  position(): Point {
    return { ...this.pos };
  }

  private storeMousePosition(e: MouseEvent): void {
    this.pos.x = e.clientX;
    this.pos.y = e.clientY;
  }
}
