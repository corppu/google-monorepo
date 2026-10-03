import * as Crypto from 'expo-crypto';

const b64url = (b64: string) =>
  b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export async function createPkcePair(): Promise<{
  codeChallenge: string;
  codeVerifier: string;
}> {
  const bytes = await Crypto.getRandomBytesAsync(32);
  const codeVerifier = b64url(btoa(String.fromCharCode(...bytes)));
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier,
    {
      encoding: Crypto.CryptoEncoding.BASE64,
    },
  );
  return { codeChallenge: b64url(digest), codeVerifier };
}
