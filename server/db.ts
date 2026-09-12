import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { CK_BRANCHES, Branch } from '../src/data/branchesData';
import { defaultMenuItems, defaultCategories } from '../src/data/defaultMenu';
import { defaultCafeSettings } from '../src/data/defaultSettings';
import { MenuItem, MenuCategory, CafeSettings } from '../src/types';

export interface BranchDataRecord {
  branch: Branch;
  menuItems: MenuItem[];
  categories: MenuCategory[];
  cafeSettings: CafeSettings;
  galleryItems?: Array<{ id: string; title: string; category: string; imageUrl: string }>;
}

interface DatabaseSchema {
  branches: Record<string, BranchDataRecord>;
}

// PostgreSQL Connection configuration (supports Vercel Postgres, Supabase, Neon, Cloud SQL)
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

let pgPool: Pool | null = null;
let isPostgresConnected = false;

if (DATABASE_URL) {
  try {
    pgPool = new Pool({
      connectionString: DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
    });
    console.log('[Database] Initialized PostgreSQL connection pool.');
  } catch (err) {
    console.error('[Database] Failed to create PostgreSQL pool, falling back:', err);
  }
}

// Fallback / Local atomic file engine
const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

let inMemoryDb: DatabaseSchema = {
  branches: {},
};

// Initialize PostgreSQL schema if connected
async function initPgSchema() {
  if (!pgPool) return;
  try {
    const client = await pgPool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS branches (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(128) NOT NULL,
          city VARCHAR(64),
          area VARCHAR(64),
          address TEXT,
          phone VARCHAR(64),
          opening_hours TEXT,
          google_maps_url TEXT,
          lat NUMERIC,
          lng NUMERIC,
          is_flagship BOOLEAN DEFAULT FALSE,
          raw_data JSONB
        );

        CREATE TABLE IF NOT EXISTS menu_categories (
          id VARCHAR(64) PRIMARY KEY,
          branch_id VARCHAR(64) NOT NULL,
          name VARCHAR(128) NOT NULL,
          description TEXT,
          icon VARCHAR(64),
          display_order INT DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS menu_items (
          id VARCHAR(64) PRIMARY KEY,
          branch_id VARCHAR(64) NOT NULL,
          category_id VARCHAR(64),
          name VARCHAR(128) NOT NULL,
          description TEXT,
          price NUMERIC NOT NULL,
          is_available BOOLEAN DEFAULT TRUE,
          is_popular BOOLEAN DEFAULT FALSE,
          image TEXT,
          tags JSONB,
          created_at BIGINT
        );

        CREATE TABLE IF NOT EXISTS site_settings (
          branch_id VARCHAR(64) PRIMARY KEY,
          cafe_name VARCHAR(128),
          address TEXT,
          phone VARCHAR(64),
          opening_hours_display TEXT,
          city VARCHAR(64),
          google_maps_url TEXT,
          currency VARCHAR(16) DEFAULT 'PKR',
          tax_rate NUMERIC DEFAULT 0,
          raw_settings JSONB,
          updated_at BIGINT
        );

        CREATE TABLE IF NOT EXISTS gallery_items (
          id VARCHAR(64) PRIMARY KEY,
          branch_id VARCHAR(64) NOT NULL,
          title VARCHAR(128),
          category VARCHAR(64),
          image_url TEXT,
          display_order INT DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(64) PRIMARY KEY,
          email VARCHAR(128) UNIQUE NOT NULL,
          role VARCHAR(32) NOT NULL DEFAULT 'branch_admin',
          branch_id VARCHAR(64) NOT NULL,
          salt VARCHAR(64) NOT NULL,
          password_hash VARCHAR(128) NOT NULL,
          created_at BIGINT
        );
      `);

      // Auto-seed initial branch admin accounts into PostgreSQL if not present
      await client.query(`
        INSERT INTO users (id, email, role, branch_id, salt, password_hash, created_at)
        VALUES
          ('user_dha4', 'dha4@example.com', 'branch_admin', 'dha-phase-4', '06bc96b2d7fa442bd4270a29b04b1fff', '4f2387698824d497a4aa4e6e8901f7fa4ce410625e30fd1bc235e5cddab83ca1e702910c9d1e492a37330e2d519361ccc7aedb0c75bfb721d8af0a11a6c4c259', 1726150000000),
          ('user_isb', 'islamabad@example.com', 'branch_admin', 'islamabad', '722b5f8a67e3b3ddc4b7866cc35e92aa', '13c0e95b98a050fa48eb8d9f30492a7fddb33d9a9b50b0e4b3045ed5b9d8479454fd3230e8895f96ed4606623db3bcb38a278e0ecdb5a74cf70892b41b88995b', 1726150000000),
          ('user_sdr', 'saddar@example.com', 'branch_admin', 'saddar', '4577d7092eb4dbe5f8e440590472f3f1', '4ef081a4fa1ba9579ab29daed90aeca83cfa5aba6caf79ef5e761cf0b5adcca821eca35c54848d2e031f144ee3d81aab85b0265b3d50482eb3136d3d7dec2887', 1726150000000)
        ON CONFLICT (email) DO NOTHING;
      `);

      isPostgresConnected = true;
      console.log('[Database] PostgreSQL schema and initial branch admin accounts verified.');
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('[Database] PostgreSQL init warning (using local fallback engine):', err);
    isPostgresConnected = false;
  }
}

// Bootstrap fallback local/memory store
function bootstrapLocalDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      inMemoryDb = JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[Database] Initializing fresh local DB structure:', err);
  }

  let updated = false;
  for (const b of CK_BRANCHES) {
    if (!inMemoryDb.branches[b.id]) {
      const branchSettings: CafeSettings = {
        ...defaultCafeSettings,
        cafeName: b.name,
        address: b.address,
        phone: b.phone,
        openingHoursDisplay: b.openingHours,
        city: b.city,
        googleMapsUrl: b.googleMapsUrl,
      };

      inMemoryDb.branches[b.id] = {
        branch: b,
        menuItems: JSON.parse(JSON.stringify(defaultMenuItems)),
        categories: JSON.parse(JSON.stringify(defaultCategories)),
        cafeSettings: branchSettings,
      };
      updated = true;
    }
  }

  if (updated) {
    saveLocalDatabase();
  }
}

// Atomic file write to prevent corrupted writes on unexpected termination
function saveLocalDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(inMemoryDb, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('[Database] Failed to write local DB file (filesystem may be read-only in serverless):', err);
  }
}

// Initialize on module load
bootstrapLocalDatabase();
if (DATABASE_URL) {
  initPgSchema().catch((err) => console.warn('[Database] Async PG init error:', err));
}

// ==========================================
// Database Operations
// ==========================================

export function getBranchData(branchId: string): BranchDataRecord | null {
  const data = inMemoryDb.branches[branchId];
  if (!data) return null;
  return JSON.parse(JSON.stringify(data));
}

export function updateBranchMenuItems(branchId: string, items: MenuItem[]): boolean {
  if (!inMemoryDb.branches[branchId]) return false;
  inMemoryDb.branches[branchId].menuItems = items;
  saveLocalDatabase();

  // Async sync to PG if connected
  if (isPostgresConnected && pgPool) {
    pgPool
      .query(
        `INSERT INTO branches (id, name, raw_data)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET raw_data = $3`,
        [branchId, inMemoryDb.branches[branchId].branch.name, JSON.stringify(inMemoryDb.branches[branchId])]
      )
      .catch((err) => console.error('[Database] PG sync error:', err));
  }

  return true;
}

export function updateBranchCategories(branchId: string, categories: MenuCategory[]): boolean {
  if (!inMemoryDb.branches[branchId]) return false;
  inMemoryDb.branches[branchId].categories = categories;
  saveLocalDatabase();
  return true;
}

export function updateBranchSettings(branchId: string, settings: CafeSettings): boolean {
  if (!inMemoryDb.branches[branchId]) return false;
  inMemoryDb.branches[branchId].cafeSettings = settings;
  saveLocalDatabase();
  return true;
}

export function deleteBranchMenuItem(branchId: string, itemId: string): boolean {
  if (!inMemoryDb.branches[branchId]) return false;
  const initialLength = inMemoryDb.branches[branchId].menuItems.length;
  inMemoryDb.branches[branchId].menuItems = inMemoryDb.branches[branchId].menuItems.filter(
    (i) => i.id !== itemId
  );
  if (inMemoryDb.branches[branchId].menuItems.length !== initialLength) {
    saveLocalDatabase();
    return true;
  }
  return false;
}

// Backup and Disaster Recovery: Export branch snapshot
export function exportBranchBackup(branchId: string): BranchDataRecord | null {
  return getBranchData(branchId);
}

// Restore branch snapshot
export function restoreBranchBackup(branchId: string, backupData: Partial<BranchDataRecord>): boolean {
  if (!inMemoryDb.branches[branchId]) return false;
  if (!backupData || typeof backupData !== 'object') return false;

  if (Array.isArray(backupData.menuItems)) {
    inMemoryDb.branches[branchId].menuItems = backupData.menuItems;
  }
  if (Array.isArray(backupData.categories)) {
    inMemoryDb.branches[branchId].categories = backupData.categories;
  }
  if (backupData.cafeSettings && typeof backupData.cafeSettings === 'object') {
    inMemoryDb.branches[branchId].cafeSettings = backupData.cafeSettings;
  }

  saveLocalDatabase();
  return true;
}

// ==========================================
// Database User Persistence & Operations
// ==========================================

export interface StoredDbUser {
  id: string;
  email: string;
  role: 'branch_admin';
  branchId: string;
  salt: string;
  passwordHash: string;
  createdAt?: number;
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');

const defaultUserSeed: Record<string, StoredDbUser> = {
  'dha4@example.com': {
    id: 'user_dha4',
    email: 'dha4@example.com',
    role: 'branch_admin',
    branchId: 'dha-phase-4',
    salt: '06bc96b2d7fa442bd4270a29b04b1fff',
    passwordHash:
      '4f2387698824d497a4aa4e6e8901f7fa4ce410625e30fd1bc235e5cddab83ca1e702910c9d1e492a37330e2d519361ccc7aedb0c75bfb721d8af0a11a6c4c259',
    createdAt: 1726150000000,
  },
  'islamabad@example.com': {
    id: 'user_isb',
    email: 'islamabad@example.com',
    role: 'branch_admin',
    branchId: 'islamabad',
    salt: '722b5f8a67e3b3ddc4b7866cc35e92aa',
    passwordHash:
      '13c0e95b98a050fa48eb8d9f30492a7fddb33d9a9b50b0e4b3045ed5b9d8479454fd3230e8895f96ed4606623db3bcb38a278e0ecdb5a74cf70892b41b88995b',
    createdAt: 1726150000000,
  },
  'saddar@example.com': {
    id: 'user_sdr',
    email: 'saddar@example.com',
    role: 'branch_admin',
    branchId: 'saddar',
    salt: '4577d7092eb4dbe5f8e440590472f3f1',
    passwordHash:
      '4ef081a4fa1ba9579ab29daed90aeca83cfa5aba6caf79ef5e761cf0b5adcca821eca35c54848d2e031f144ee3d81aab85b0265b3d50482eb3136d3d7dec2887',
    createdAt: 1726150000000,
  },
};

let inMemoryUsers: Record<string, StoredDbUser> = { ...defaultUserSeed };

try {
  if (fs.existsSync(USERS_FILE)) {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    inMemoryUsers = { ...defaultUserSeed, ...JSON.parse(raw) };
  } else {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(inMemoryUsers, null, 2), 'utf-8');
  }
} catch (err) {
  console.warn('[Database] User file load note:', err);
}

function saveLocalUsers() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${USERS_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(inMemoryUsers, null, 2), 'utf-8');
    fs.renameSync(tempFile, USERS_FILE);
  } catch (err) {
    console.error('[Database] Failed to write local users file:', err);
  }
}

export function getPgPool(): Pool | null {
  return pgPool;
}

export function getIsPostgresConnected(): boolean {
  return isPostgresConnected;
}

export async function getDbUserByEmail(email: string): Promise<StoredDbUser | null> {
  const normalized = email.trim().toLowerCase();

  // Try PostgreSQL if pool is available
  if (pgPool) {
    try {
      const res = await pgPool.query(
        `SELECT id, email, role, branch_id as "branchId", salt, password_hash as "passwordHash", created_at as "createdAt"
         FROM users WHERE LOWER(email) = LOWER($1)`,
        [normalized]
      );
      if (res.rows.length > 0) {
        return res.rows[0] as StoredDbUser;
      }
    } catch (err) {
      console.warn('[Database] PG query error, checking fallback store:', err);
    }
  }

  // Fallback to local store
  const local = inMemoryUsers[normalized];
  if (local) return JSON.parse(JSON.stringify(local));
  return null;
}

export async function getDbUserById(id: string): Promise<StoredDbUser | null> {
  if (pgPool) {
    try {
      const res = await pgPool.query(
        `SELECT id, email, role, branch_id as "branchId", salt, password_hash as "passwordHash", created_at as "createdAt"
         FROM users WHERE id = $1`,
        [id]
      );
      if (res.rows.length > 0) {
        return res.rows[0] as StoredDbUser;
      }
    } catch (err) {
      console.warn('[Database] PG query error by ID:', err);
    }
  }

  for (const user of Object.values(inMemoryUsers)) {
    if (user.id === id) return JSON.parse(JSON.stringify(user));
  }
  return null;
}

export async function saveDbUser(user: StoredDbUser): Promise<void> {
  const normalized = user.email.trim().toLowerCase();
  inMemoryUsers[normalized] = { ...user, email: normalized };
  saveLocalUsers();

  if (pgPool) {
    try {
      await pgPool.query(
        `INSERT INTO users (id, email, role, branch_id, salt, password_hash, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (email) DO UPDATE
         SET salt = $5, password_hash = $6, branch_id = $4, role = $3`,
        [
          user.id,
          normalized,
          user.role || 'branch_admin',
          user.branchId,
          user.salt,
          user.passwordHash,
          user.createdAt || Date.now(),
        ]
      );
    } catch (err) {
      console.error('[Database] Failed to insert/update user in PostgreSQL:', err);
    }
  }
}

export async function updateDbUserPassword(
  userId: string,
  newSalt: string,
  newPasswordHash: string
): Promise<boolean> {
  let found = false;
  for (const [email, user] of Object.entries(inMemoryUsers)) {
    if (user.id === userId) {
      inMemoryUsers[email].salt = newSalt;
      inMemoryUsers[email].passwordHash = newPasswordHash;
      found = true;
      break;
    }
  }
  if (found) {
    saveLocalUsers();
  }

  if (pgPool) {
    try {
      const res = await pgPool.query(
        `UPDATE users SET salt = $1, password_hash = $2 WHERE id = $3`,
        [newSalt, newPasswordHash, userId]
      );
      if (res.rowCount && res.rowCount > 0) {
        return true;
      }
    } catch (err) {
      console.error('[Database] PG update password error:', err);
    }
  }

  return found;
}

