import type { Auth } from 'googleapis';
import type { Group, Member } from '@gm/lib-common-google';
import { GoogleGroupRepository } from '../repositories/GoogleGroupRepository';
import { GoogleGroupMapper } from '../mappers/GoogleGroupMapper';
import { GoogleGroupMemberMapper } from '../mappers/GoogleGroupMemberMapper';
import { GoogleGroupFilter } from '../filters/GoogleGroupFilter';
import { GoogleGroupMemberFilter } from '../filters/GoogleGroupMemberFilter';

export class GoogleGroupService {
  private repo: GoogleGroupRepository;
  constructor(auth: Auth.OAuth2Client) {
    this.repo = new GoogleGroupRepository(auth);
  }
  async list(): Promise<Group[]> {
    return (await this.repo.list()).map(GoogleGroupMapper).filter(GoogleGroupFilter);
  }
  async members(groupKey: string): Promise<Member[]> {
    return (await this.repo.members(groupKey)).map(GoogleGroupMemberMapper).filter(GoogleGroupMemberFilter);
  }
}
