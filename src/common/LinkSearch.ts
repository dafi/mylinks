import Fuse from 'fuse.js';
import type { Link as MMLink } from '../model/MyLinks-interface';

const fuseOptions = {
  keys: ['label'],
  includeMatches: true,
  minMatchCharLength: 2,
};

export type LinkResultMatch = {
  indices: ReadonlyArray<[number, number]>;
  value?: string;
};

export interface LinkSearchResult {
  id: string;
  link: MMLink;
  matches: readonly LinkResultMatch[] | undefined;
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

    return this.fuse.search(pattern).map(r => (
      { id: r.item.id, link: r.item, matches: r.matches })
    );
  }
}
