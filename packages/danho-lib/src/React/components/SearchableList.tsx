import { Functionable } from '@danho-lib/Utils/types';
import { React, ReactNode, useState, useCallback, useMemo } from '../React';
import { classNames } from '../utils';
import { useDebounceCallback } from '@hooks/useDebounce';

type Props<TItem> = {
  items: TItem[];
  renderItem: (item: TItem, index: number, array: Array<TItem>) => React.ReactNode;
  onSearch: (search: string, item: TItem) => boolean;
  
  placeholder?: string;
  className?: string;
  noResult?: Functionable<ReactNode>;
  take?: number;
  children?: Functionable<ReactNode>;
}

export function SearchableList<TItem>(props: Props<TItem>) {
  const { items, renderItem, onSearch } = props;
  const { placeholder = 'Search...', className, noResult, take, children } = props;

  const [search, _setSearch] = useState<string>('');
  const setSearch = useDebounceCallback((value: string) => _setSearch(value), 300);
  const SearchableItem = useCallback(({ item, index }: { item: TItem, index: number }) => renderItem(item, index, items), [renderItem, items]);
  const Children = useCallback(() => typeof children === 'function' ? children() : children, [children]);
  const filteredItems = useMemo(() => (
    items
      .filter(item => search ? onSearch(search, item) : true)
      .slice(0, take ?? 25)
  ), [items, search, onSearch, take]);

  return (
    <div className={classNames('searchable-list', className)}>
      <div className="searchable-list__input-container">
        <input
          className="searchable-list__input"
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Children />
      </div>
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
    </div>
  );
}