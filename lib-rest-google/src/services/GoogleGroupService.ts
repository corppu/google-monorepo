import type { Group, Member } from '@gm/lib-common-google';
import type { Auth } from 'googleapis';

import {
  GoogleGroupValidator,
  GoogleGroupMemberValidator,
  unwrapValidationResult,
} from '@gm/lib-common-google';

import type { GroupRepository } from '../repositories/interfaces';

import { GoogleGroupFilter } from '../filters/GoogleGroupFilter';
import { GoogleGroupMemberFilter } from '../filters/GoogleGroupMemberFilter';
import { GoogleGroupRepository } from '../repositories/GoogleGroupRepository';

export class GoogleGroupService {
  private repo: GroupRepository;
  constructor(auth: Auth.OAuth2Client | undefined, repo?: GroupRepository) {
    this.repo = repo ?? new GoogleGroupRepository(auth!);
  }
  async list(): Promise<Group[]> {
    return (await this.repo.list())
      .map((input) => unwrapValidationResult(GoogleGroupValidator(input)))
      .filter(GoogleGroupFilter);
  }
  async members(groupKey: string): Promise<Member[]> {
    return (await this.repo.members(groupKey))
      .map((input) => unwrapValidationResult(GoogleGroupMemberValidator(input)))
      .filter(GoogleGroupMemberFilter);
  }
}
