import { ComponentProps, ReactNode } from 'react';
import { Button, Scope } from '../button/Button';
import './Footer.css';

export type FooterButton = {
  id: string;
  label: string;
  type?: ComponentProps<'button'>['type'];
  scope?: Scope;
  onClick?: (item: FooterButton) => void;
  disabled?: boolean;
};

type FooterProps = Readonly<{
  leftButtons?: FooterButton[];
  rightButtons: FooterButton[];
}>;

function buttonArray(buttons: FooterButton[]): ReactNode[] {
  return buttons.map((button, i) => {
    const { id, onClick, scope = i === 0 ? 'primary' : 'secondary', ...buttonProps } = button;

    const validProps: ComponentProps<'button'> = {};

    if (onClick) {
      validProps.onClick = (): void => {
        onClick(button);
      };
    }

    return (
      <Button
        key={id}
        scope={scope}
        {...buttonProps}
        {...validProps}
      />);
  });
}

export function Footer({ leftButtons, rightButtons }: FooterProps): ReactNode {
  return (
    <footer className="footer">
      <div className="button-container">
        <div className="left-container">
          {leftButtons && buttonArray(leftButtons)}
        </div>
        <div className="right-container">
          {buttonArray(rightButtons)}
        </div>
      </div>
    </footer>
  );
}
