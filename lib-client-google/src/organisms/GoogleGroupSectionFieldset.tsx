import type { Group } from '@gm/lib-common-google';
import { ChunkedList, SectionFieldset } from '@gm/lib-client-common';

export const GoogleGroupSectionFieldset = ({
  groups,
  onSelect,
  selectedGroupEmail = '',
}: {
  groups?: Group[];
  onSelect?: (groupEmail: string) => void;
  selectedGroupEmail?: string;
}) => {
  const groupItems = (groups ?? [])
    .filter((group) => group.email)
    .map((group) => ({
      email: group.email!,
      id: group.id ?? group.email!,
      label: group.name ?? group.email!,
    }));
  const items = onSelect
    ? [
        { email: '', id: 'all-calendars', label: 'All calendars' },
        ...groupItems,
      ]
    : groupItems;

  return (
    <SectionFieldset legend="Google group">
      <ChunkedList
        ariaLabel="Google groups"
        getKey={(group) => group.id}
        items={items}
        selectedKey={
          onSelect ? selectedGroupEmail || 'all-calendars' : undefined
        }
        renderItem={(group) =>
          onSelect ? (
            <label>
              <input
                type="radio"
                name="google-group"
                value={group.email}
                checked={selectedGroupEmail === group.email}
                onChange={() => onSelect(group.email)}
              />
              {group.label}
            </label>
          ) : (
            group.label
          )
        }
      />
    </SectionFieldset>
  );
};
