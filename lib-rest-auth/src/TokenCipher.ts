import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'node:crypto';

/** AES-256-GCM encryption for tokens at rest. The key is derived from a secret with SHA-256. */
export class TokenCipher {
  private key: Buffer;

  constructor(secret: string) {
    if (!secret) throw new Error('A token encryption secret is required');
    this.key = createHash('sha256').update(secret).digest();
  }

  encrypt(plain: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    return [iv, cipher.getAuthTag(), data]
      .map((b) => b.toString('base64url'))
      .join('.');
  }

  decrypt(payload: string): string {
    const [iv, tag, data] = payload
      .split('.')
      .map((p) => Buffer.from(p, 'base64url'));
    if (!iv || !tag || !data) throw new Error('Malformed encrypted payload');
    const decipher = createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString(
      'utf8',
    );
  }
}
