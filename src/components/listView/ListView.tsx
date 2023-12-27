import {
  createRef,
  ForwardedRef,
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { ListViewHandle, ListViewItem } from './ListViewTypes';

const ClickCount = 2;

type ListViewProps = {
  readonly items: ListViewItem[];
  readonly onSelectionChange?: (index: number) => void;
  readonly onSelected?: (index: number) => void;
  readonly tabIndex?: number;
};

type ListViewRefMap = Map<string, RefObject<HTMLLIElement>>;

const defaultProps = {
  onSelectionChange: undefined,
  onSelected: undefined,
  tabIndex: -1,
};

function createRefMap(items: ListViewItem[]): ListViewRefMap {
  const map = new Map<string, RefObject<HTMLLIElement>>();
  for (const i of items) {
    map.set(i.id, createRef());
  }
  return map;
}

export const ListView = forwardRef(function(
  { items, onSelectionChange, onSelected, tabIndex }: ListViewProps,
  ref: ForwardedRef<ListViewHandle>
): ReactElement {
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

    updateSelectedIndex(index);
  }

  function onMouseDown(e: MouseEvent<HTMLElement>): void {
    // use mouseDown instead of dblClick to prevent text selection on double click
    if (e.detail !== ClickCount) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    const strIndex = e.currentTarget.dataset.index;
    const index = strIndex === undefined ? 0 : +strIndex;

    updateSelectedIndex(index);

    if (onSelected) {
      onSelected(index);
    }
  }

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [listRefs, setListRefs] = useState<ListViewRefMap>();

  const listViewRef = useRef<HTMLDivElement>(null);

  const updateSelectedIndex = useCallback((index: number): void => {
    setSelectedIndex(_ => {
      if (onSelectionChange) {
        onSelectionChange(index);
      }
      return index;
    });
  }, [onSelectionChange]);

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLElement>): void => {
    const currIndex = selectedIndex;
    let newIndex = -1;

    switch (e.key) {
      case 'ArrowUp':
        if (currIndex > 0) {
          newIndex = currIndex - 1;
        }
        break;
      case 'ArrowDown':
        if (currIndex < (items.length - 1)) {
          newIndex = currIndex + 1;
        }
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = items.length - 1;
        break;
      case 'Enter':
        if (currIndex >= 0 && onSelected) {
          onSelected(currIndex);
        }
        break;
      default:
        return;
    }
    if (newIndex >= 0) {
      const item = items[newIndex];
      const liElement = listRefs?.get(item.id)?.current;
      if (liElement) {
        liElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
      updateSelectedIndex(newIndex);
    }
    e.preventDefault();
  }, [items, listRefs, onSelected, selectedIndex, updateSelectedIndex]);

  useEffect(() => {
    setSelectedIndex(items.length > 0 ? 0 : -1);
    setListRefs(createRefMap(items));
  }, [items]);

  useImperativeHandle(ref, (): ListViewHandle => ({
    onKeyDown(e: KeyboardEvent<HTMLElement>): void {
      onKeyDown(e);
    },
  }), [onKeyDown]);

  return (
    <div tabIndex={tabIndex} onKeyDown={onKeyDown} ref={listViewRef}>
      <ul>
        {items.map((item, index) =>
          <li
            onClick={onClick}
            onMouseDown={onMouseDown}
            data-index={index}
            className={index === selectedIndex ? 'selected' : 'none'}
            ref={listRefs?.get(item.id)}
            key={item.id}
          >
            {item.element}
          </li>
        )}
      </ul>
    </div>
  );
});

ListView.defaultProps = defaultProps;
