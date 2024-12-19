import { PropsWithChildren, ReactNode } from 'react';
import './StickyBox.css';

type StickyBoxProps = PropsWithChildren<object>;

export function StickyBox(
  {
    children
  }: StickyBoxProps
): ReactNode {
  return (
    <div className="sticky-box">
      {children}
    </div>
  );
}
