import type { Member } from '@gm/lib-common-google';
import type { Filter } from './Filter';

export const GoogleGroupMemberFilter: Filter<Member> = (item) => !!item.email;
