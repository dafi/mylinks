import { PropsWithChildren, ReactElement } from 'react';
import './StickyBox.css';

type StickyBoxProps = PropsWithChildren<object>;

export function StickyBox(
  {
    children
  }: StickyBoxProps
): ReactElement {
  return (
    <div className="sticky-box">
      {children}
    </div>
  );
}
