import { ReactElement } from 'react';
import { AppToolbarButtonProps } from './AppToolbarButtonTypes';
import { AppToolbarFileButton } from './AppToolbarFileButton';

const defaultProps: Pick<AppToolbarButtonProps, 'type' | 'style'> = {
  type: 'button',
  style: undefined
};

export function AppToolbarButton(
  {
    title,
    className,
    action,
    type,
    icon,
    onAction,
    style,
    data,
  }: AppToolbarButtonProps
): ReactElement {
  if (type === 'file') {
    return (
      <AppToolbarFileButton
        title={title}
        className={className}
        action={action}
        icon={icon}
        onAction={onAction}
      />
    );
  }
  return (
    <label
      className={className}
      title={title}
      style={style}
      onClick={(): void => onAction(action, data)}
    >
      <i className={icon} />
    </label>
  );
}

AppToolbarButton.defaultProps = defaultProps;
