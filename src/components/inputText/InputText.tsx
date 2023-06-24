import React, { ChangeEvent, ReactNode, RefObject } from 'react';
import { debounce } from '../../common/debounce';

export interface InputTextProps {
  autofocus?: boolean;
  defaultValue?: string;
  onText?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  debounce?: number;
  className?: string;
}

export class InputText extends React.Component<InputTextProps, unknown> {
  private inputRef: RefObject<HTMLInputElement> = React.createRef();
  private stopDebounceCallback?: () => void;
  private onInputChange?: (value: string) => void;

  constructor(props: InputTextProps) {
    super(props);
  }

  get value(): string | undefined {
    return this.inputRef.current?.value;
  }

  focus(): void {
    this.inputRef.current?.focus();
  }

  onChange(e: ChangeEvent<HTMLInputElement>): void {
    if (this.onInputChange) {
      this.onInputChange(e.target.value);
    }
  }

  componentDidMount(): void {
    if (this.props.autofocus === true) {
      this.inputRef.current?.focus();
    }
    const userOnChange = this.props.onText;
    if (this.props.debounce && userOnChange) {
      const [debounceCallback, stopDebounceCallback] = debounce(a => {
        userOnChange(a as string);
      }, this.props.debounce);
      this.onInputChange = debounceCallback;
      this.stopDebounceCallback = stopDebounceCallback;
    } else {
      this.onInputChange = userOnChange;
    }
  }

  componentWillUnmount(): void {
    if (this.stopDebounceCallback) {
      this.stopDebounceCallback();
    }
  }

  render(): ReactNode {
    return <input
      type="text"
      ref={this.inputRef}
      className={this.props.className}
      defaultValue={this.props.defaultValue}
      onKeyDown={this.props.onKeyDown}
      onChange={(e): void => this.onChange(e)}/>;
  }
}
