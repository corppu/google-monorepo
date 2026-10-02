import type { Location } from '@gm/lib-common-google';
import type { Filter } from './Filter';

export const GoogleLocationFilter: Filter<Location> = (item) => !!(item.name || item.address);
