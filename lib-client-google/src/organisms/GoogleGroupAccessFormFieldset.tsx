import type { Group } from '@gm/lib-common-google';

export const GoogleGroupAccessFormFieldset = ({
  groups,
  onSelect,
  selectedGroupEmail = '',
}: {
  groups?: Group[];
  onSelect?: (groupEmail: string) => void;
  selectedGroupEmail?: string;
}) => (
  <fieldset>
    <legend>Google group</legend>
    {onSelect ? (
      <label>
        Group
        <select
          value={selectedGroupEmail}
          onChange={(event) => onSelect(event.currentTarget.value)}
        >
          <option value="">All calendars</option>
          {groups?.map((group) =>
            group.email ? (
              <option key={group.id ?? group.email} value={group.email}>
                {group.name ?? group.email}
              </option>
            ) : null,
          )}
        </select>
      </label>
    ) : (
      <ul>
        {groups?.map((group) => (
          <li key={group.id ?? group.email}>{group.name ?? group.email}</li>
        ))}
      </ul>
    )}
  </fieldset>
);
