import { ChangeEvent, createRef, KeyboardEvent, MouseEvent, ReactElement, RefObject, useRef, useState } from 'react';
import { LinkSearch, LinkSearchResult } from '../../common/LinkSearch';
import { isNotEmptyString } from '../../common/StringUtil';
import { useAppConfigContext } from '../../contexts/AppConfigContext';
import { Link, Widget } from '../../model/MyLinks-interface';
import { LinkIcon } from '../widgets/linkIcon/LinkIcon';
import './LinkSelector.css';

interface LinkSelectorProps {
  readonly widgets: Widget[][];
  readonly onSelected: (link: Link) => void;
}

export function LinkSelector(
  {
    widgets,
    onSelected,
  }: LinkSelectorProps
): ReactElement {
  function moveFocusToSearch(): void {
    inputRef.current?.focus();
  }

  function onClick(e: MouseEvent<HTMLElement>): void {
    // skip if a dblclick is in progress
    // https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail
    if (e.detail !== 1) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    const strIndex = e.currentTarget.dataset.index;
    const index = strIndex === undefined ? 0 : +strIndex;

    moveFocusToSearch();
    setSelectedIndex(index);
  }

  function onDoubleClick(e: MouseEvent<HTMLElement>): void {
    e.preventDefault();
    e.stopPropagation();

    moveFocusToSearch();

    const strIndex = e.currentTarget.dataset.index;
    const index = strIndex === undefined ? 0 : +strIndex;

    onSelected(result[index].link);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    const currIndex = selectedIndex;
    let newIndex = -1;

    switch (e.key) {
      case 'ArrowUp':
        if (currIndex > 0) {
          newIndex = currIndex - 1;
        }
        break;
      case 'ArrowDown':
        if (currIndex < (result.length - 1)) {
          newIndex = currIndex + 1;
        }
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = result.length - 1;
        break;
      case 'Enter':
        if (currIndex >= 0) {
          onSelected(result[currIndex].link);
        }
        break;
      default:
        return;
    }
    if (newIndex !== -1) {
      const item = result[newIndex];
      const liElement = listRefs.get(item.id)?.current;
      if (liElement) {
        liElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
      setSelectedIndex(newIndex);
    }
    e.preventDefault();
  }

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const pattern = e.target.value;
    // https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1193
    // eslint-disable-next-line unicorn/no-array-callback-reference
    const r = linkSearch.filter(pattern);

    setListRefs(createRefMap(r));
    setSelectedIndex(r.length > 0 ? 0 : -1);
    setResult(r);
  }

  function createRefMap(linkSearchResult: LinkSearchResult[]): Map<string, RefObject<HTMLLIElement>> {
    const map = new Map<string, RefObject<HTMLLIElement>>();
    for (const i of linkSearchResult) {
      map.set(i.id, createRef());
    }
    return map;
  }

  function widgetTitle(link: Link): string {
    const title = myLinksLookup?.findWidgetByLinkId(link.id)?.title;
    return isNotEmptyString(title) ? ` - ${title}` : '';
  }

  const { myLinksLookup } = useAppConfigContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const linkSearch = new LinkSearch();
  const [result, setResult] = useState<LinkSearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [listRefs, setListRefs] = useState(createRefMap(result));

  const links = widgets.flat().flatMap(w => w.list);
  linkSearch.setLinks(links);

  return (
    <div className="link-selector">
      <div className="input-container">
        <i className="fas fa-search icon" />
        <input
          type="text"
          data-auto-focus="true"
          ref={inputRef}
          onKeyDown={onKeyDown}
          onChange={onChange}
          placeholder="Search"
          spellCheck="false"
          className="input-box"
        />
      </div>
      <div className="list">
        <ul>
          {result.map((r, i) =>
            <li
              onClick={onClick}
              onDoubleClick={onDoubleClick}
              data-index={i}
              className={i === selectedIndex ? 'selected' : 'none'}
              ref={listRefs.get(r.id) ?? null}
              key={r.id}
            >
              <i className="list-image">
                <LinkIcon link={r.link} />
              </i>
              <div>
                {/* eslint-disable-next-line react/no-danger */}
                <span dangerouslySetInnerHTML={{ __html: r.highlighted }} />
                {widgetTitle(r.link)}
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
