import { Functionable } from '@danho-lib/Utils/types';
import { React, ReactNode, useState, useCallback, useMemo, forwardRef } from '../React';
import { classNames } from '../utils';
import { ScrollerAuto, ScrollerLooks } from '@discord/components';

type Props<TItem> = {
  items: TItem[];
  renderItem: (item: TItem, index: number, array: Array<TItem>) => React.ReactNode;
  onSearch: (search: string, item: TItem) => boolean;

  placeholder?: string;
  className?: string;
  noResult?: Functionable<ReactNode>;
  take?: number;
  children?: Functionable<ReactNode>;
};

function SearchableListInner<TItem>(
  props: Props<TItem>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const { items, renderItem, onSearch } = props;
  const {
    placeholder = 'Search...', take = 25,
    className, noResult, children,
  } = props;

  const [search, setSearch] = useState<string>('');
  const SearchableItem = useCallback(({ item, index }: { item: TItem; index: number; }) => renderItem(item, index, items), [renderItem, items]);
  const Children = useCallback(() => (typeof children === 'function' ? children() : children), [children]);
  const filteredItems = useMemo(() => (
    items
      .filter(item => (search ? onSearch(search, item) : true))
      .slice(0, take)
  ), [items, search, onSearch, take]);

  return (
    <div className={classNames('searchable-list', className)}>
      <div className="searchable-list__input-container">
        <input ref={ref}
          className="searchable-list__input"
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Children />
      </div>
      <ScrollerAuto className={ScrollerLooks.thin}>
        <ul className="searchable-list__items">
          {filteredItems.map((item, index) => (
            <li key={index} className="searchable-list__item">
              <SearchableItem item={item} index={index} />
            </li>
          ))}
          {filteredItems.length === 0 && noResult && (
            <li className="searchable-list__item--no-result">
              {typeof noResult === 'function' ? noResult() : noResult}
            </li>
          )}
        </ul>
      </ScrollerAuto>
    </div>
  );
}

// Use forwardRef with a generic type to preserve TItem inference
export const SearchableList = forwardRef(SearchableListInner) as <TItem>(
  props: Props<TItem> & { ref?: React.ForwardedRef<HTMLInputElement>; }
) => ReturnType<typeof SearchableListInner>;