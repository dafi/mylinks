import { ComponentProps, ReactElement } from 'react';
import './Button.css';

export type ScopeType = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

type ButtonProps = ComponentProps<'button'> & Readonly<{
  label: string;
  scope?: ScopeType;
}>;

const cssScopeMap: Readonly<Record<ScopeType, string>> = {
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
): ReactElement {
  const validProps: ComponentProps<'button'> = {};

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
