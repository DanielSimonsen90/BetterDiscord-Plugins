import { Functionable } from '@danho-lib/Utils/types';
import { React, ReactNode, useState, useCallback } from '../React';
import { classNames } from '../utils';

type Props<TItem> = {
  items: TItem[];
  children: (item: TItem) => React.ReactNode;
  onSearch: (search: string, item: TItem) => boolean;
  
  placeholder?: string;
  className?: string;
  noResult?: Functionable<ReactNode>;
  take?: number;
}

export function SearchableList<TItem>(props: Props<TItem>) {
  const { items, children, onSearch } = props;
  const { placeholder = 'Search...', className, noResult, take } = props;

  const [search, setSearch] = useState<string>('');
  const SearchableItem = useCallback(({ item }: { item: TItem }) => children(item), [children]);
  const filteredItems = items
    .filter(item => search ? onSearch(search, item) : true)
    .slice(0, take ?? 25);

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
      </div>
      <ul className="searchable-list__items">
        {filteredItems.map((item, index) => (
          <li key={index} className="searchable-list__item">
            <SearchableItem item={item} />
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