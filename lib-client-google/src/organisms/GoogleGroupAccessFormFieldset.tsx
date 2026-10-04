import type { Group } from '@gm/lib-common-google';
import { ChunkedList } from '@gm/lib-client-common';
import './GoogleAccessFormFieldset.css';

export const GoogleGroupAccessFormFieldset = ({
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
    <fieldset className="gm-google-access-fieldset">
      <legend className="gm-google-access-fieldset__legend">
        Google group
      </legend>
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
    </fieldset>
  );
};
