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
      <ul>
        <li>
          <label>
            <input
              type="radio"
              name="google-group"
              value=""
              checked={!selectedGroupEmail}
              onChange={() => onSelect('')}
            />
            All calendars
          </label>
        </li>
        {groups?.map((group) =>
          group.email ? (
            <li key={group.id ?? group.email}>
              <label>
                <input
                  type="radio"
                  name="google-group"
                  value={group.email}
                  checked={selectedGroupEmail === group.email}
                  onChange={() => onSelect(group.email!)}
                />
                {group.name ?? group.email}
              </label>
            </li>
          ) : null,
        )}
      </ul>
    ) : (
      <ul>
        {groups?.map((group) => (
          <li key={group.id ?? group.email}>{group.name ?? group.email}</li>
        ))}
      </ul>
    )}
  </fieldset>
);
