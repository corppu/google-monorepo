import type { Group } from '@gm/lib-common-google';
import type { Filter } from './Filter';

export const GoogleGroupFilter: Filter<Group> = (item) => !!item.id;
