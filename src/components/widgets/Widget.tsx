import React, { ReactNode, RefObject } from 'react';
import { AppUIStateContext } from '../../common/AppUIStateContext';
import { debounce } from '../../common/debounce';
import { MyLinksEvent } from '../../model/Events';
import { Widget as MLWidget } from '../../model/MyLinks-interface';
import { Link } from './Link';
import './Widget.css';
import { WidgetToolbar, WidgetToolbarActionType } from './WidgetToolbar';

export interface WidgetProps {
  value: MLWidget;
}

interface WidgetState {
  collapsed: boolean;
  editable: boolean;
}

interface WidgetExtraCssClass {
  widget: string;
}

export class Widget extends React.Component<WidgetProps, WidgetState> {
  static contextType = AppUIStateContext;
  context!: React.ContextType<typeof AppUIStateContext>;
  private startCollapsed = false;

  private inputRef: RefObject<HTMLInputElement> = React.createRef();

  constructor(props: WidgetProps) {
    super(props);
    this.startCollapsed = localStorage.getItem(`${this.props.value.id}-collapsed`) === 't';
    this.state = { collapsed: this.startCollapsed, editable: false };
  }

  toggleCollapse(collapsed: boolean): void {
    if (this.startCollapsed) {
      this.setState({ collapsed });
    }
  }

  toggleWidgetSize(): void {
    this.startCollapsed = !this.startCollapsed;
    localStorage.setItem(`${this.props.value.id}-collapsed`, this.startCollapsed ? 't' : 'f');
    this.setState({ collapsed: this.startCollapsed });
  }

  cssExtraClasses(): WidgetExtraCssClass {
    const collapsed = this.state.collapsed;
    const collapsedVisible = this.startCollapsed && !collapsed;
    const cls: WidgetExtraCssClass = {
      widget: '',
    };

    if (this.startCollapsed) {
      cls.widget += 'collapsed ';
    }
    if (collapsedVisible) {
      cls.widget += 'collapsed-visible ';
    }

    return cls;
  }

  onClickToolbar(e: MyLinksEvent<WidgetToolbarActionType>): void {
    if (e.target === 'collapse') {
      this.toggleWidgetSize();
    } else if (e.target === 'edit') {
      this.onToggleEdit();
    }
  }

  onToggleEdit(): void {
    this.setState(prevState => ({
      editable: !prevState.editable
    }));
  }

  onAddLink(): void {
    if (this.context.onEdit) {
      const widget = this.props.value;
      this.context.onEdit({
        link: { id: `${widget.id}-${new Date().getTime()}`, url: '', shortcut: '', label: '' },
        widget,
        editType: 'create'
      });
    }
  }

  onChangeTitle(e: React.ChangeEvent<HTMLInputElement>): void {
    if (this.context.onEdit) {
      const widget = this.props.value;
      this.context.onEdit({
        widget,
        editType: 'update',
        editedProperties: { title: e.target.value }
      });
    }
  }

  private onKeydownTitle(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Escape' || e.key === 'Enter') {
      this.setState({
        editable: false
      });
    }
  }

  renderButtons(): ReactNode | null {
    if (this.state.editable) {
      return (
        <div className="ml-widget-button-container">
          <button className="button" onClick={(): void => this.onAddLink()}>Add New Link</button>
        </div>
      );
    }
    return null;
  }

  renderTitle(): ReactNode {
    const widget = this.props.value;

    if (this.state.editable) {
      const waitMS = 1500;
      const returnedFunction = debounce(a => {
        this.onChangeTitle(a as React.ChangeEvent<HTMLInputElement>);
      }, waitMS);

      return <input type="text"
                    ref={this.inputRef}
                    className="edit-title"
                    defaultValue={widget.title}
                    onKeyDown={(e): void => this.onKeydownTitle(e)}
                    onChange={returnedFunction}/>;
    }
    return widget.title;
  }

  componentDidUpdate(): void {
    if (this.state.editable) {
      this.inputRef.current?.focus();
    }
  }

  render(): ReactNode {
    const widget = this.props.value;
    const editable = this.state.editable;
    const items = widget.list.map(v => <li key={v.url}>
      <Link
        link={v}
        widget={widget}
        editable={editable}/>
    </li>);
    const cls = this.cssExtraClasses();

    return (
      <div className={`ml-widget ${cls.widget}`}
           data-list-id={widget.id}
           onMouseEnter={(): void => this.toggleCollapse(false)}
           onMouseLeave={(): void => this.toggleCollapse(true)}>
        <div>
          <h2 className="ml-widget-title">{this.renderTitle()}</h2>
          <WidgetToolbar
            collapsed={this.startCollapsed}
            widget={widget}
            editable={editable}
            action={(e): void => this.onClickToolbar(e)}
            classNames={'hover-toolbar'}/>
        </div>
        <div className="ml-widget-list-container">
          <ul className="ml-widget-list">{items}</ul>
        </div>
        {this.renderButtons()}
      </div>);
  }
}
