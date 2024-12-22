import { ChangeEvent, ComponentProps, ReactNode } from 'react';

function validateUrls(urls: string[], el: HTMLTextAreaElement): boolean {
  if (urls.length === 0) {
    el.setCustomValidity('Url is mandatory');
    return false;
  }
  const invalidUrl = urls.find(url => !/^[a-z]*:\/\/.*/.test(url));
  if (invalidUrl !== undefined) {
    el.setCustomValidity(`Invalid url '${invalidUrl}'`);
    return false;
  }
  el.setCustomValidity('');
  return true;
}

type InputUrlSingleProps = Readonly<{
  onChange: (url: string) => void;
  type: 'single';
}> & Omit<ComponentProps<'input'>, 'onChange' | 'type'>;

type InputUrlMultipleProps = Readonly<{
  onChange: (urls: string[]) => void;
  defaultValue: string[];
  type: 'multiple';
}> & Omit<ComponentProps<'textarea'>, 'onChange' | 'type'>;

export function InputUrl(
  {
    defaultValue,
    onChange,
    type,
    ...props
  }: InputUrlSingleProps | InputUrlMultipleProps
): ReactNode {
  function onValidate(e: ChangeEvent<HTMLTextAreaElement>): void {
    if (type === 'multiple') {
      const trimmed = e.target.value.trim();
      const text = trimmed.length === 0 ? [] : trimmed.split(/\n+/);
      if (validateUrls(text, e.target)) {
        onChange(text);
      }
    }
  }

  if (type === 'single') {
    return (
      <input
        // typescript is unable to understand that props are relative to 'input' so we force it using the type assertion
        {...(props as ComponentProps<'input'>)}
        type="url"
        defaultValue={defaultValue}
        onChange={e => onChange(e.target.value)}
        placeholder="Favicon Url"
      />
    );
  }
  return (
    <textarea
      // typescript is unable to understand that props are relative to 'textarea' so we force it using the type assertion
      {...(props as ComponentProps<'textarea'>)}
      defaultValue={Array.isArray(defaultValue) ? defaultValue.join('\n') : defaultValue}
      onChange={onValidate}
    />
  );
}
