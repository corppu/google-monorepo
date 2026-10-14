import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import './ChunkedList.css';

export interface ChunkedListProps<T> {
  ariaLabel: string;
  chunkSize?: number;
  getKey: (item: T) => string;
  items: readonly T[];
  renderItem: (item: T) => ReactNode;
  selectedKey?: string;
}

export const ChunkedList = <T,>({
  ariaLabel,
  chunkSize = 50,
  getKey,
  items,
  renderItem,
  selectedKey,
}: ChunkedListProps<T>) => {
  const pageCount = Math.max(1, Math.ceil(items.length / chunkSize));
  const selectedIndex = selectedKey
    ? items.findIndex((item) => getKey(item) === selectedKey)
    : -1;
  const selectedPage =
    selectedIndex >= 0 ? Math.floor(selectedIndex / chunkSize) : null;
  const [page, setPage] = useState(selectedPage ?? 0);
  useEffect(() => {
    if (selectedPage !== null) setPage(selectedPage);
  }, [selectedPage]);

  const currentPage = Math.min(page, pageCount - 1);
  const start = currentPage * chunkSize;
  const end = Math.min(start + chunkSize, items.length);
  const pageItems = items.slice(start, end);
  const selectedItem = selectedIndex >= 0 ? items[selectedIndex] : undefined;
  const selectedIsOnPage = selectedIndex >= start && selectedIndex < end;

  return (
    <div className="gm-client-chunked-list">
      <ul aria-label={ariaLabel} className="gm-client-chunked-list__items">
        {selectedItem && !selectedIsOnPage && (
          <li
            className="gm-client-chunked-list__selected"
            key={`selected-${getKey(selectedItem)}`}
          >
            {renderItem(selectedItem)}
          </li>
        )}
        {pageItems.map((item) => (
          <li key={getKey(item)}>{renderItem(item)}</li>
        ))}
      </ul>
      {items.length > chunkSize && (
        <nav
          aria-label={`${ariaLabel} pages`}
          className="gm-client-chunked-list__pagination"
        >
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() => setPage(Math.max(0, currentPage - 1))}
          >
            Previous page
          </button>
          <span aria-live="polite">
            Items {start + 1}-{end} of {items.length}
          </span>
          <button
            type="button"
            disabled={currentPage === pageCount - 1}
            onClick={() => setPage(Math.min(pageCount - 1, currentPage + 1))}
          >
            Next page
          </button>
        </nav>
      )}
    </div>
  );
};
