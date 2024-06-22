import { ReactNode, useState } from 'react';

export type ErrorBoxProps = Readonly<{
  error: unknown;
}>;

function errorToString(error: unknown): string {
  return '' + (error as string);
}

export function ErrorBox(
  {
    error
  }: ErrorBoxProps
): ReactNode {
  function onClose(): void {
    setHidden(true);
  }
  const [hidden, setHidden] = useState(false);

  if (hidden) {
    return null;
  }
  return (
    <div className="error-box bg-action-danger-60">
      <span className="message">{errorToString(error)}</span>
      <button className="button bg-action-danger" onClick={onClose}>Close</button>
    </div>
  );
}
