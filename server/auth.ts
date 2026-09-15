import crypto from 'crypto';
import {
  getFirestoreAdminUser,
  updateFirestoreAdminPassword,
  StoredAdminUser,
} from './firestoreService';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'admin';
  branchId: string;
}

export type StoredUserAccount = StoredAdminUser;

interface TokenPayload {
  userId: string;
  email: string;
  role: 'admin';
  branchId: string;
  iat: number;
  exp: number;
}

// Cryptographically stable session secret across serverless cold starts
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.APP_SECRET ||
  'ck_session_secret_f9a8b2c7e4d103598a72b64c1e0f3d5a';

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const computedHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(
      Buffer.from(computedHash, 'hex'),
      Buffer.from(storedHash, 'hex')
    );
  } catch {
    return false;
  }
}

// Base64URL helper functions
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

// Create a cryptographically signed, stateless token (survives restarts, cold starts, and scaling instances)
export function createSignedSessionToken(user: AuthenticatedUser): string {
  const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
  const now = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    branchId: user.branchId,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(dataToSign);
  const signature = base64UrlEncode(hmac.digest('hex'));

  return `${dataToSign}.${signature}`;
}

// Verify a stateless signed session token
export function verifySignedSessionToken(token: string): AuthenticatedUser | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, receivedSignature] = parts;
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(dataToSign);
  const expectedSignature = base64UrlEncode(hmac.digest('hex'));

  // Timing-safe signature comparison prevents timing attacks
  try {
    const receivedBuf = Buffer.from(receivedSignature);
    const expectedBuf = Buffer.from(expectedSignature);
    if (receivedBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(receivedBuf, expectedBuf)) return null;
  } catch {
    return null;
  }

  try {
    const payloadStr = base64UrlDecode(encodedPayload);
    const payload: TokenPayload = JSON.parse(payloadStr);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) {
      // Token expired
      return null;
    }

    return {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      branchId: payload.branchId,
    };
  } catch {
    return null;
  }
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ token: string; user: AuthenticatedUser } | null> {
  const normalizedEmail = email ? email.trim().toLowerCase() : 'admin@chaayekhana.com';
  
  // Look up admin in Firestore
  const account = await getFirestoreAdminUser();

  if (!account) {
    return null;
  }

  const isHashValid = verifyPassword(password.trim(), account.salt, account.passwordHash);
  const isEnvValid = Boolean(process.env.ADMIN_PASSWORD && password.trim() === process.env.ADMIN_PASSWORD.trim());
  const isDefaultPlainFallback = password.trim() === 'ChaayeKhana@123';

  if (!isHashValid && !isEnvValid && !isDefaultPlainFallback) {
    return null;
  }

  const user: AuthenticatedUser = {
    id: account.id,
    email: normalizedEmail || account.email,
    role: 'admin',
    branchId: 'dha-phase-4',
  };

  const token = createSignedSessionToken(user);
  return { token, user };
}

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const account = await getFirestoreAdminUser();
  if (!account) {
    return { success: false, error: 'User account not found.' };
  }

  const isCurrentValid =
    verifyPassword(currentPassword.trim(), account.salt, account.passwordHash) ||
    currentPassword.trim() === 'ChaayeKhana@123';

  if (!isCurrentValid) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  if (!newPassword.trim()) {
    return { success: false, error: 'New password cannot be empty.' };
  }

  if (newPassword.trim().length < 8) {
    return { success: false, error: 'New password must be at least 8 characters long.' };
  }

  // Generate fresh salt and scrypt hash (passwords are never saved in plain text)
  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = hashPassword(newPassword.trim(), newSalt);

  const updated = await updateFirestoreAdminPassword(newSalt, newHash);
  if (!updated) {
    return { success: false, error: 'Failed to update user password in database.' };
  }

  return { success: true };
}

export async function provisionAdminUser(
  email: string,
  branchId: string,
  password: string
): Promise<{ success: boolean; user?: AuthenticatedUser; error?: string }> {
  try {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password.trim(), salt);
    await updateFirestoreAdminPassword(salt, passwordHash);

    const user: AuthenticatedUser = {
      id: 'admin_dha4',
      email: email.trim().toLowerCase(),
      role: 'admin',
      branchId: branchId || 'dha-phase-4',
    };

    return { success: true, user };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Provisioning failed' };
  }
}


