import { ChangeEvent, KeyboardEvent, ReactElement, useRef, useState } from 'react';
import { LinkSearch, LinkSearchResult } from '../../common/LinkSearch';
import { Link } from '../../model/MyLinks-interface';
import { ListView } from '../listView/ListView';
import { ListViewHandle, ListViewItem } from '../listView/ListViewTypes';
import './LinkSelector.css';
import { LinkSearchResultViewItem } from './LinkSearchResultViewItem';

function formatMatches<R, T>(result: R[], total: T[]): string {
  // one day I will migrate to a localization library using plurals, for now this is enough
  const matchesText = result.length === 1 ? 'match' : 'matches';
  const totalText = total.length === 1 ? 'link' : 'links';
  return `${result.length} ${matchesText} in ${total.length} ${totalText}`;
}

interface LinkSelectorProps {
  readonly links: Link[];
  readonly onSelected: (link: Link) => void;
}

export function LinkSelector(
  {
    links,
    onSelected,
  }: LinkSelectorProps
): ReactElement {
  function onSelectionChange(_index: number): void {
    inputRef.current?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    listViewRef.current?.onKeyDown(e);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>): void {
    const pattern = e.target.value;
    // https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1193
    // eslint-disable-next-line unicorn/no-array-callback-reference
    setResult(linkSearch.filter(pattern));
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const listViewRef = useRef<ListViewHandle>(null);
  const linkSearch = new LinkSearch();
  const [result, setResult] = useState<LinkSearchResult[]>([]);

  linkSearch.setLinks(links);

  const listComponents = result.map((item): ListViewItem => (
    {
      id: item.id,
      element: <LinkSearchResultViewItem item={item} />
    })
  );

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
      <div className="matches">
        {formatMatches(result, links)}
      </div>
      <div className="list">
        <ListView
          ref={listViewRef}
          items={listComponents}
          onSelectionChange={onSelectionChange}
          selectedIndex={0}
          onSelected={(i): void => onSelected(result[i].link)}
        />
      </div>
    </div>
  );
}
