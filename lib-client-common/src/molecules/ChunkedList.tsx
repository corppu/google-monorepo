import { useState } from 'react';
import type { ReactNode } from 'react';
import './ChunkedList.css';

export interface ChunkedListProps<T> {
  ariaLabel: string;
  chunkSize?: number;
  getKey: (item: T) => string;
  items: readonly T[];
  renderItem: (item: T) => ReactNode;
}

export const ChunkedList = <T,>({
  ariaLabel,
  chunkSize = 50,
  getKey,
  items,
  renderItem,
}: ChunkedListProps<T>) => {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / chunkSize));
  const currentPage = Math.min(page, pageCount - 1);
  const start = currentPage * chunkSize;
  const end = Math.min(start + chunkSize, items.length);
  const pageItems = items.slice(start, end);

  return (
    <div className="gm-client-chunked-list">
      <ul aria-label={ariaLabel} className="gm-client-chunked-list__items">
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
