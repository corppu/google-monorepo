import type {
  OidcRepository,
  OidcUser,
  PendingLogin,
  RefreshTokenRecord,
} from './types';

export class InMemoryOidcRepository implements OidcRepository {
  private users = new Map<string, OidcUser>();
  private pending = new Map<string, PendingLogin>();

  private refresh = new Map<string, RefreshTokenRecord>();

  async deleteRefreshTokens(by: { familyId: string } | { userId: string }) {
    for (const [h, r] of this.refresh)
      if (
        'familyId' in by ? r.familyId === by.familyId : r.userId === by.userId
      )
        this.refresh.delete(h);
  }

  async isFamilyActive(familyId: string) {
    return [...this.refresh.values()].some(
      (r) => r.familyId === familyId && r.expiresAt > Date.now(),
    );
  }

  async saveRefreshToken(record: RefreshTokenRecord) {
    this.refresh.set(record.hash, record);
  }

  async takeRefreshToken(hash: string) {
    const r = this.refresh.get(hash);
    this.refresh.delete(hash);
    return r && r.expiresAt > Date.now() ? r : undefined;
  }

  async findUser(id: string) {
    return this.users.get(id);
  }

  async savePendingLogin(login: PendingLogin) {
    this.pending.set(login.state, login);
  }

  async takePendingLogin(state: string) {
    const login = this.pending.get(state);
    this.pending.delete(state);
    return login && login.expiresAt > Date.now() ? login : undefined;
  }

  async upsertUser(user: OidcUser) {
    this.users.set(user.id, user);
  }
}
