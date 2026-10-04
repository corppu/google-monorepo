import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { theme } from '@gm/lib-client-theme';

export interface ChunkedListProps<T> {
  accessibilityLabel: string;
  chunkSize?: number;
  getKey: (item: T) => string;
  items: readonly T[];
  renderItem: (item: T) => ReactNode;
  selectedKey?: string;
}

const styles = StyleSheet.create({
  list: {
    gap: theme.spacing.field,
  },
  pageButton: {
    borderColor: theme.colors.border,
    borderRadius: theme.radius.control,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.buttonHorizontal,
    paddingVertical: theme.spacing.buttonVertical,
  },
  pageButtonDisabled: {
    opacity: 0.45,
  },
  pageButtonText: {
    color: theme.colors.ink,
    fontSize: theme.typography.label,
  },
  pagination: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  range: {
    color: theme.colors.mutedInk,
    fontSize: theme.typography.label,
  },
});

export const ChunkedList = <T,>({
  accessibilityLabel,
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
    <View accessibilityLabel={accessibilityLabel} style={styles.list}>
      {selectedItem && !selectedIsOnPage && (
        <View key={`selected-${getKey(selectedItem)}`}>
          {renderItem(selectedItem)}
        </View>
      )}
      {pageItems.map((item) => (
        <View key={getKey(item)}>{renderItem(item)}</View>
      ))}
      {items.length > chunkSize && (
        <View style={styles.pagination}>
          <Pressable
            accessibilityLabel={`Previous ${accessibilityLabel} page`}
            accessibilityRole="button"
            accessibilityState={{ disabled: currentPage === 0 }}
            disabled={currentPage === 0}
            onPress={() => setPage(Math.max(0, currentPage - 1))}
            style={[
              styles.pageButton,
              currentPage === 0 && styles.pageButtonDisabled,
            ]}
          >
            <Text style={styles.pageButtonText}>Previous</Text>
          </Pressable>
          <Text accessibilityLiveRegion="polite" style={styles.range}>
            Items {start + 1}-{end} of {items.length}
          </Text>
          <Pressable
            accessibilityLabel={`Next ${accessibilityLabel} page`}
            accessibilityRole="button"
            accessibilityState={{ disabled: currentPage === pageCount - 1 }}
            disabled={currentPage === pageCount - 1}
            onPress={() => setPage(Math.min(pageCount - 1, currentPage + 1))}
            style={[
              styles.pageButton,
              currentPage === pageCount - 1 && styles.pageButtonDisabled,
            ]}
          >
            <Text style={styles.pageButtonText}>Next</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};
