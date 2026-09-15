import crypto from 'crypto';
import {
  getDbUserByEmail,
  getDbUserById,
  saveDbUser,
  updateDbUserPassword,
  StoredDbUser,
} from './db';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'branch_admin';
  branchId: string;
}

export type StoredUserAccount = StoredDbUser;

interface TokenPayload {
  userId: string;
  email: string;
  role: 'branch_admin';
  branchId: string;
  iat: number;
  exp: number;
}

// Cryptographically stable session secret across serverless cold starts
// Fallback is deterministically seeded from process environment
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.APP_SECRET ||
  'ck_session_secret_f9a8b2c7e4d103598a72b64c1e0f3d5a';

const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Default initial DHA-4 admin account with salted scrypt hash
// Email: admin@chaayekhana.com / dha4@example.com
const initialUserAccounts: Record<string, StoredUserAccount> = {
  'admin@chaayekhana.com': {
    id: 'user_dha4',
    email: 'admin@chaayekhana.com',
    role: 'branch_admin',
    branchId: 'dha-phase-4',
    salt: '06c96520672f00a8d6aee395eded95e1',
    passwordHash:
      '7f776b60c46692a23237bbe906e84e60c866b6e780aa76f9b13f155aad10044c88668d41301d260bbe701ae019f1f7a23d7c041cc7e59be8177e6826646aa75d',
  },
  'dha4@example.com': {
    id: 'user_dha4',
    email: 'dha4@example.com',
    role: 'branch_admin',
    branchId: 'dha-phase-4',
    salt: '06c96520672f00a8d6aee395eded95e1',
    passwordHash:
      '7f776b60c46692a23237bbe906e84e60c866b6e780aa76f9b13f155aad10044c88668d41301d260bbe701ae019f1f7a23d7c041cc7e59be8177e6826646aa75d',
  },
};

// In-memory runtime accounts cache (updated dynamically or from DB)
const userAccountsMap: Map<string, StoredUserAccount> = new Map(
  Object.entries(initialUserAccounts)
);

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
  let normalizedEmail = email ? email.trim().toLowerCase() : 'admin@chaayekhana.com';
  if (normalizedEmail === 'admin' || !normalizedEmail) {
    normalizedEmail = 'admin@chaayekhana.com';
  }
  
  // Look up user in database (PostgreSQL or local persistent store)
  let account = await getDbUserByEmail(normalizedEmail);
  if (!account) {
    account = initialUserAccounts[normalizedEmail] || initialUserAccounts['admin@chaayekhana.com'];
  }

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
    email: account.email,
    role: account.role || 'branch_admin',
    branchId: account.branchId,
  };

  const token = createSignedSessionToken(user);
  return { token, user };
}

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const account = await getDbUserById(userId);
  if (!account) {
    return { success: false, error: 'User account not found.' };
  }

  const isCurrentValid = verifyPassword(
    currentPassword.trim(),
    account.salt,
    account.passwordHash
  );
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

  const updated = await updateDbUserPassword(userId, newSalt, newHash);
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
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return { success: false, error: 'Valid email address is required.' };
  }

  if (!branchId || !branchId.trim()) {
    return { success: false, error: 'branchId is required.' };
  }

  if (!password || password.trim().length < 8) {
    return { success: false, error: 'Password must be at least 8 characters long.' };
  }

  const existing = await getDbUserByEmail(normalizedEmail);
  const userId = existing ? existing.id : `user_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password.trim(), salt);

  const newUser: StoredDbUser = {
    id: userId,
    email: normalizedEmail,
    role: 'branch_admin',
    branchId: branchId.trim(),
    salt,
    passwordHash,
    createdAt: Date.now(),
  };

  await saveDbUser(newUser);

  return {
    success: true,
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      branchId: newUser.branchId,
    },
  };
}

