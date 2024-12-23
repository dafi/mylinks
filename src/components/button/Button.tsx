import { ComponentPropsWithoutRef, ReactNode } from 'react';
import './Button.css';

export type Scope = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

type ButtonProps = Readonly<{
  label: string;
  scope?: Scope;
}> & ComponentPropsWithoutRef<'button'>;

const cssScopeMap: Readonly<Record<Scope, string>> = {
  primary: 'text-white bg-action-primary',
  secondary: 'text-white bg-action-secondary',
  success: 'text-white bg-action-success',
  warning: 'text-white bg-action-warning',
  danger: 'text-white bg-action-danger',
};

export function Button(
  {
    label,
    onClick,
    className,
    scope = 'primary',
    ...buttonProps
  }: ButtonProps
): ReactNode {
  const validProps: ComponentPropsWithoutRef<'button'> = {};

  if (onClick) {
    validProps.onClick = (e): void => {
      e.preventDefault();
      onClick(e);
    };
  }

  return (
    <button
      className={`ml-button hover ${className ?? ''} ${cssScopeMap[scope]}`}
      {...buttonProps}
      {...validProps}
    >
      {label}
    </button>
  );
}
