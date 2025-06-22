import { useEffect, useRef } from 'react';
import { LinkSearch } from '../../common/LinkSearch';
import { Link } from '../../model/MyLinks-interface';

export function useLinkSearch(links: Link[]): LinkSearch {
  const linkSearchRef = useRef(new LinkSearch());

  useEffect(() => {
    linkSearchRef.current.setLinks(links);
  }, [links]);

  return linkSearchRef.current;
}
