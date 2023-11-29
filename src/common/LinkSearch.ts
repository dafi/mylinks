import Fuse from 'fuse.js';
import type { Link as MMLink } from '../model/MyLinks-interface';
import { highlight } from './HtmlUtil';
import { isNotEmptyString } from './StringUtil';

const fuseOptions = {
  keys: ['label'],
  includeMatches: true,
  minMatchCharLength: 2,
};

export interface LinkSearchResult {
  id: string;
  link: MMLink;
  highlighted: string;
}

export class LinkSearch {
  private fuse = new Fuse([] as MMLink[], fuseOptions);

  setLinks(links: MMLink[]): void {
    this.fuse.setCollection(links);
  }

  filter(pattern: string): LinkSearchResult[] {
    if (pattern.length === 0) {
      return [];
    }

    return this.fuse.search(pattern).map(r => {
      const m = r.matches;
      const highlighted = m?.[0] && isNotEmptyString(m[0].value) ? highlight(m[0].value, m[0].indices) : r.item.label;
      return { id: r.item.id, link: r.item, highlighted };
    });
  }
}
