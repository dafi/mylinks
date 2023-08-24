import { ChangeEvent, ReactElement } from 'react';

import { AppToolbarButtonProps } from './AppToolbarButtonTypes';

export function AppToolbarFileButton(
  {
    title,
    className,
    action,
    icon,
    onAction,
  }: AppToolbarButtonProps
): ReactElement {
  function handleFileSelect(evt: ChangeEvent<HTMLInputElement>): void {
    const file = evt.target.files?.[0] ?? null;
    // onChange is not called when the path is the same so, we force the change
    evt.target.value = '';
    if (file) {
      onAction(action, file);
    }
  }

  return (
    <label
      className={className}
      title={title}
    >
      <i className={icon} />
      <input
        type="file"
        id="files"
        name="files[]"
        accept="application/json"
        onChange={handleFileSelect}
      />
    </label>
  );
}
