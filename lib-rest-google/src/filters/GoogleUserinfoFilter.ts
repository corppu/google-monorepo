import type { Userinfo } from '@gm/lib-common-google';
import type { Filter } from './Filter';

export const GoogleUserinfoFilter: Filter<Userinfo> = (item) => !!item.id;
