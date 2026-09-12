const SALT_PREFIX = 'ck_dha4_artisan_sec_';

/**
 * Computes a cryptographic SHA-256 hash of the given password string.
 * Uses a salt prefix to protect against rainbow table attacks.
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(`${SALT_PREFIX}${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies if an input password matches the stored password hash.
 */
export async function verifyPassword(
  inputPassword: string,
  storedHash?: string
): Promise<boolean> {
  if (!inputPassword) return false;
  const inputHash = await hashPassword(inputPassword);

  if (storedHash) {
    return inputHash === storedHash;
  }

  // Fallback to default initial PIN "1234"
  const defaultHash = await hashPassword('1234');
  return inputHash === defaultHash;
}
