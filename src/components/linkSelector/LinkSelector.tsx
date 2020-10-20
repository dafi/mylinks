import React, {ChangeEvent, ReactNode, RefObject} from 'react';
import './LinkSelector.css';
import {faviconUrlByLink, Link, Widget} from '../../model/MyLinks';
import Fuse from 'fuse.js';
import {AppConfigContext} from '../../common/AppConfigContext';

interface Result {
  id: string,
  link: Link
}

export interface LinkSelectorProps {
  widgets: [Widget[]] | undefined,
  onSelected: (link: Link) => void
}

interface LinkSelectorState {
  result: Result[]
  selectedIndex: number
}

export class LinkSelector extends React.Component<LinkSelectorProps, LinkSelectorState> {
  private listRefs = new Map<string, RefObject<HTMLLIElement>>();
  private inputRef: RefObject<HTMLInputElement> = React.createRef();
  private fuse: Fuse<Link>;

  constructor(props: LinkSelectorProps) {
    super(props);
    this.state = {
      result: [],
      selectedIndex: -1
    };
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);

    const links = this.props.widgets?.flat().map(w => w.list).flat() || [];
    const options = {
      keys: ['label']
    };
    this.fuse = new Fuse(links, options);
  }

  moveFocusToSearch(): void {
    const el = this.inputRef?.current;
    if (el) {
      el.focus();
    }
  }

  componentDidMount(): void {
    this.moveFocusToSearch();
  }

  onClick(e: React.MouseEvent<HTMLElement>, index: number): void {
    e.preventDefault();
    e.stopPropagation();

    this.moveFocusToSearch();

    this.setState({
      selectedIndex: index
    });
  }

  onDoubleClick(e: React.MouseEvent<HTMLElement>, index: number): void {
    e.preventDefault();
    e.stopPropagation();

    this.moveFocusToSearch();
    this.props.onSelected(this.state.result[index].link);
  }

  onKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    const currIndex = this.state.selectedIndex;
    let newIndex = -1;

    if (e.key === 'ArrowUp') {
      if (currIndex > 0) {
        newIndex = currIndex - 1;
      }
    } else if (e.key === 'ArrowDown') {
      if (currIndex < (this.state.result.length - 1)) {
        newIndex = currIndex + 1;
      }
    } else if (e.key === 'Enter') {
      if (currIndex >= 0) {
        this.props.onSelected(this.state.result[currIndex].link);
      }
    } else {
      return;
    }
    if (newIndex !== -1) {
      const item = this.state.result[newIndex];
      const liElement = this.listRefs.get(item.id)?.current;
      if (liElement) {
        liElement.scrollIntoView({block: 'nearest', inline: 'nearest'});
      }
      this.setState({
        selectedIndex: newIndex
      });
    }
    e.preventDefault();
  }

  render(): ReactNode {
    return (
      <div className="link-selector">
        <div className="input-container">
          <i className="fas fa-search icon"/>
          <input type="text"
            ref={this.inputRef}
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
            placeholder="Search"
            spellCheck="false"
            className="input-box"/>
        </div>
        <div className="list">
          <ul>
            {this.state.result.map((r, i) => {
              return <li
                onClick={(e) => this.onClick(e, i)}
                onDoubleClick={(e) => this.onDoubleClick(e, i)}
                className={i === this.state.selectedIndex ? 'selected' : 'none'}
                ref={this.listRefs.get(r.id) ?? null}
                key={r.id}><i className="list-image">{this.image(r.link)}</i>
                <div>{r.link.widget?.title || ''} - {r.link.label}</div>
              </li>;
            })}
          </ul>
        </div>
      </div>
    );
  }

  onChange(e: ChangeEvent<HTMLInputElement>): void {
    const pattern = e.target.value;
    const result = this.filter(pattern);

    this.listRefs = result.reduce((acc, r) => {
      acc.set(r.id, React.createRef());
      return acc;
    }, new Map<string, RefObject<HTMLLIElement>>());

    this.setState({
      result: result,
      selectedIndex: result.length ? 0 : -1
    });
  }

  filter(pattern: string): Result[] {
    if (pattern.length === 0) {
      return [];
    }

    return this.fuse.search(pattern).map(result => {
      return {id: result.item.id, link: result.item};
    });
  }

  image(item: Link): ReactNode {
    const faviconUrl = faviconUrlByLink(item, this.context.faviconService);

    if (faviconUrl) {
      return <img src={faviconUrl} alt=''/>;
    }
    return <div className="missing-image missing-favicon"/>;
  }
}

LinkSelector.contextType = AppConfigContext;

