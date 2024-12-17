import { ComponentProps, ReactElement } from 'react';
import { Button } from '../button/Button';
import './Footer.css';

export type FooterButton = {
  id: string;
  label: string;
  type?: ComponentProps<'button'>['type'];
  isPrimary?: boolean;
  onClick?: (item: FooterButton) => void;
  disabled?: boolean;
};

type FooterProps = Readonly<{
  leftButtons?: FooterButton[];
  rightButtons: FooterButton[];
}>;

function buttonArray(buttons: FooterButton[]): ReactElement[] {
  return buttons.map((button, i) => {
    const { id, onClick, isPrimary = i === 0, ...buttonProps } = button;

    const validProps: ComponentProps<'button'> = {};

    if (onClick) {
      validProps.onClick = (): void => {
        onClick(button);
      };
    }

    return (
      <Button
        key={id}
        scope={isPrimary ? 'primary' : 'secondary'}
        {...buttonProps}
        {...validProps}
      />);
  });
}

export function Footer({ leftButtons, rightButtons }: FooterProps): ReactElement {
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
